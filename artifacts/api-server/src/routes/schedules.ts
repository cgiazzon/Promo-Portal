import { Router, type IRouter } from "express";
import { eq, and, inArray } from "drizzle-orm";
import { db, schedulesTable, offersTable, groupsTable } from "@workspace/db";

const router: IRouter = Router();

async function enrichSchedule(
  schedule: typeof schedulesTable.$inferSelect,
  entrepreneurId: number
) {
  const groupIds: number[] = JSON.parse(schedule.groupIds);

  const [offer] = await db
    .select({ title: offersTable.title })
    .from(offersTable)
    .where(eq(offersTable.id, schedule.offerId))
    .limit(1);

  let groupNames: string[] = [];
  if (groupIds.length > 0) {
    const groups = await db
      .select({ id: groupsTable.id, name: groupsTable.name })
      .from(groupsTable)
      .where(
        and(
          inArray(groupsTable.id, groupIds),
          eq(groupsTable.entrepreneurId, entrepreneurId)
        )
      );
    groupNames = groupIds.map(id => groups.find(g => g.id === id)?.name ?? String(id));
  }

  return {
    id: schedule.id,
    offerId: schedule.offerId,
    offerTitle: offer?.title ?? null,
    groupIds,
    groupNames,
    scheduledAt: schedule.scheduledAt.toISOString(),
    status: schedule.status,
    shortUrl: schedule.shortUrl ?? null,
    createdAt: schedule.createdAt.toISOString(),
  };
}

router.get("/schedules", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const schedules = await db
      .select()
      .from(schedulesTable)
      .where(eq(schedulesTable.entrepreneurId, entrepreneurId));

    const enriched = await Promise.all(schedules.map(s => enrichSchedule(s, entrepreneurId)));
    res.json(enriched);
  } catch (e) {
    console.error("GET /schedules error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/schedules", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const { offerId, groupIds, scheduledAt, shortUrl } = req.body as {
      offerId: number; groupIds: number[]; scheduledAt: string; shortUrl?: string;
    };

    if (groupIds && groupIds.length > 0) {
      const ownedGroups = await db
        .select({ id: groupsTable.id })
        .from(groupsTable)
        .where(
          and(
            inArray(groupsTable.id, groupIds),
            eq(groupsTable.entrepreneurId, entrepreneurId)
          )
        );
      if (ownedGroups.length !== groupIds.length) {
        res.status(403).json({ message: "Um ou mais grupos não pertencem a você" });
        return;
      }
    }

    const [schedule] = await db
      .insert(schedulesTable)
      .values({
        offerId,
        entrepreneurId,
        groupIds: JSON.stringify(groupIds ?? []),
        scheduledAt: new Date(scheduledAt),
        status: "pending",
        shortUrl: shortUrl ?? null,
      })
      .returning();

    const enriched = await enrichSchedule(schedule, entrepreneurId);
    res.status(201).json(enriched);
  } catch (e) {
    console.error("POST /schedules error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/schedules/:id", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const id = parseInt(req.params.id);
    const { offerId, groupIds, scheduledAt, status, shortUrl } = req.body as {
      offerId?: number; groupIds?: number[]; scheduledAt?: string; status?: string; shortUrl?: string;
    };

    if (groupIds && groupIds.length > 0) {
      const ownedGroups = await db
        .select({ id: groupsTable.id })
        .from(groupsTable)
        .where(
          and(
            inArray(groupsTable.id, groupIds),
            eq(groupsTable.entrepreneurId, entrepreneurId)
          )
        );
      if (ownedGroups.length !== groupIds.length) {
        res.status(403).json({ message: "Um ou mais grupos não pertencem a você" });
        return;
      }
    }

    const updates: Record<string, unknown> = {};
    if (offerId !== undefined) updates.offerId = offerId;
    if (groupIds !== undefined) updates.groupIds = JSON.stringify(groupIds);
    if (scheduledAt !== undefined) updates.scheduledAt = new Date(scheduledAt);
    if (status !== undefined) updates.status = status;
    if (shortUrl !== undefined) updates.shortUrl = shortUrl;

    const [updated] = await db
      .update(schedulesTable)
      .set(updates)
      .where(and(eq(schedulesTable.id, id), eq(schedulesTable.entrepreneurId, entrepreneurId)))
      .returning();

    if (!updated) {
      res.status(404).json({ message: "Agendamento não encontrado" });
      return;
    }

    const enriched = await enrichSchedule(updated, entrepreneurId);
    res.json(enriched);
  } catch (e) {
    console.error("PUT /schedules/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.delete("/schedules/:id", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const id = parseInt(req.params.id);
    const [deleted] = await db
      .delete(schedulesTable)
      .where(and(eq(schedulesTable.id, id), eq(schedulesTable.entrepreneurId, entrepreneurId)))
      .returning();
    if (!deleted) {
      res.status(404).json({ message: "Agendamento não encontrado" });
      return;
    }
    res.status(204).send();
  } catch (e) {
    console.error("DELETE /schedules/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
