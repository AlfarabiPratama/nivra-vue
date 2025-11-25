import { beforeEach, describe, expect, it } from "vitest";
import { db, dbPromise } from "../../src/db/indexeddb";

// Helper to clear all stores between tests
async function clearAll() {
  const instance = await dbPromise;
  for (const name of instance.objectStoreNames) {
    await instance.clear(name);
  }
}

describe("IndexedDB wrapper", () => {
  beforeEach(async () => {
    await clearAll();
  });

  it("initializes stores", async () => {
    const instance = await dbPromise;
    expect(Array.from(instance.objectStoreNames)).toEqual(
      expect.arrayContaining([
        "habits",
        "transactions",
        "todos",
        "journals",
        "meta",
      ])
    );
  });

  it("adds and retrieves habit record", async () => {
    const id = await db.add("habits", { title: "Meditasi", streak: 0 });
    const record = await db.get("habits", id);
    expect(record.title).toBe("Meditasi");
    expect(record.id).toBe(id);
  });

  it("updates record via put", async () => {
    const id = await db.add("todos", {
      text: "Tuliskan jurnal",
      status: "pending",
    });
    await db.put("todos", { id, text: "Tuliskan jurnal", status: "done" });
    const updated = await db.get("todos", id);
    expect(updated.status).toBe("done");
  });

  it("deletes record", async () => {
    const id = await db.add("journals", {
      date: "2025-11-21",
      content: "Hari ini fokus.",
    });
    await db.delete("journals", id);
    const all = await db.getAll("journals");
    expect(all.find((r) => r.id === id)).toBeUndefined();
  });
});
