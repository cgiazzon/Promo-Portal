import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, groupsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/groups", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const groups = await db
      .select()
      .from(groupsTable)
      .where(eq(groupsTable.entrepreneurId, entrepreneurId));
    res.json(groups);
  } catch (e) {
    console.error("GET /groups error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/groups", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const { name, niche, connectionToken } = req.body as { name?: string; niche?: string; connectionToken?: string };
    if (!name || !niche) {
      res.status(400).json({ message: "name e niche são obrigatórios" });
      return;
    }
    const [group] = await db
      .insert(groupsTable)
      .values({ name, niche, entrepreneurId, connectionToken: connectionToken ?? null, connectionStatus: "disconnected" })
      .returning();
    res.status(201).json(group);
  } catch (e) {
    console.error("POST /groups error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.get("/groups/:id", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const id = parseInt(req.params.id);
    const [group] = await db
      .select()
      .from(groupsTable)
      .where(and(eq(groupsTable.id, id), eq(groupsTable.entrepreneurId, entrepreneurId)))
      .limit(1);
    if (!group) {
      res.status(404).json({ message: "Grupo não encontrado" });
      return;
    }
    res.json(group);
  } catch (e) {
    console.error("GET /groups/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.put("/groups/:id", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const id = parseInt(req.params.id);
    const { name, niche, connectionToken } = req.body as { name?: string; niche?: string; connectionToken?: string };
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (niche !== undefined) updates.niche = niche;
    if (connectionToken !== undefined) updates.connectionToken = connectionToken;
    const [updated] = await db
      .update(groupsTable)
      .set(updates)
      .where(and(eq(groupsTable.id, id), eq(groupsTable.entrepreneurId, entrepreneurId)))
      .returning();
    if (!updated) {
      res.status(404).json({ message: "Grupo não encontrado" });
      return;
    }
    res.json(updated);
  } catch (e) {
    console.error("PUT /groups/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.delete("/groups/:id", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const id = parseInt(req.params.id);
    const [deleted] = await db
      .delete(groupsTable)
      .where(and(eq(groupsTable.id, id), eq(groupsTable.entrepreneurId, entrepreneurId)))
      .returning();
    if (!deleted) {
      res.status(404).json({ message: "Grupo não encontrado" });
      return;
    }
    res.status(204).send();
  } catch (e) {
    console.error("DELETE /groups/:id error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

router.post("/groups/:id/test-connection", async (req, res): Promise<void> => {
  try {
    const entrepreneurId = req.user!.sub;
    const id = parseInt(req.params.id);
    const [group] = await db
      .select()
      .from(groupsTable)
      .where(and(eq(groupsTable.id, id), eq(groupsTable.entrepreneurId, entrepreneurId)))
      .limit(1);
    if (!group) {
      res.status(404).json({ message: "Grupo não encontrado" });
      return;
    }
    const newStatus = group.connectionToken ? "connected" : "disconnected";
    const [updated] = await db
      .update(groupsTable)
      .set({ connectionStatus: newStatus })
      .where(eq(groupsTable.id, id))
      .returning();
    res.json({ success: newStatus === "connected", status: newStatus, group: updated });
  } catch (e) {
    console.error("POST /groups/:id/test-connection error:", e);
    res.status(500).json({ message: "Erro interno" });
  }
});

export default router;
