import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, collaboratorsTable } from "@workspace/db";
import { InviteCollaboratorBody, UpdateCollaboratorBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/collaborators", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const rows = await db
      .select()
      .from(collaboratorsTable)
      .where(eq(collaboratorsTable.entrepreneurId, entrepreneurId));

    res.json(rows.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      permissions: JSON.parse(c.permissions) as string[],
      status: c.status,
      createdAt: c.createdAt.toISOString(),
    })));
  } catch (e) {
    console.error("GET /collaborators error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/collaborators", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const body = InviteCollaboratorBody.parse(req.body);

    const [collab] = await db
      .insert(collaboratorsTable)
      .values({
        entrepreneurId,
        email: body.email,
        permissions: JSON.stringify(body.permissions ?? []),
        status: "pending",
      })
      .returning();

    res.status(201).json({
      id: collab.id,
      name: collab.name,
      email: collab.email,
      permissions: JSON.parse(collab.permissions) as string[],
      status: collab.status,
      createdAt: collab.createdAt.toISOString(),
    });
  } catch (e) {
    console.error("POST /collaborators error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/collaborators/:id", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const id = parseInt(req.params.id);
    const body = UpdateCollaboratorBody.parse(req.body);

    const [updated] = await db
      .update(collaboratorsTable)
      .set({ permissions: JSON.stringify(body.permissions ?? []) })
      .where(and(eq(collaboratorsTable.id, id), eq(collaboratorsTable.entrepreneurId, entrepreneurId)))
      .returning();

    if (!updated) {
      res.status(404).json({ message: "Colaborador não encontrado" });
      return;
    }

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      permissions: JSON.parse(updated.permissions) as string[],
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch (e) {
    console.error("PUT /collaborators/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.delete("/collaborators/:id", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const id = parseInt(req.params.id);
    const [deleted] = await db
      .delete(collaboratorsTable)
      .where(and(eq(collaboratorsTable.id, id), eq(collaboratorsTable.entrepreneurId, entrepreneurId)))
      .returning();
    if (!deleted) {
      res.status(404).json({ message: "Colaborador não encontrado" });
      return;
    }
    res.status(204).send();
  } catch (e) {
    console.error("DELETE /collaborators/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
