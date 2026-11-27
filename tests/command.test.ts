import { test } from "node:test";
import assert from "node:assert/strict";
import { ReviewedCommand } from "../src/command.ts";

test("uncertain writes keep UUID, revision and payload even if inputs change", async () => {
  const state = new ReviewedCommand<{ code: string }>(12);
  let first: unknown;
  await assert.rejects(
    state.send({ code: "Original" }, async (command) => {
      first = command;
      throw new Error("Connection failed");
    }),
  );
  assert.throws(() => state.review(15), /incierto/);
  await state.send({ code: "Changed" }, async (command) => assert.deepEqual(command, first));
});

test("confirmed conflict needs explicit review and creates a new command", async () => {
  const state = new ReviewedCommand<{ code: string }>(12);
  let firstId = "";
  await assert.rejects(
    state.send({ code: "Original" }, async (command) => {
      firstId = command.command_id;
      throw { message: "Revision changed; refresh and review" };
    }),
  );
  await assert.rejects(
    state.send({ code: "Original" }, async () => assert.fail()),
    /Actualiza/,
  );
  state.review(15);
  await state.send({ code: "Original" }, async (command) => {
    assert.equal(command.expected_revision, 15);
    assert.notEqual(command.command_id, firstId);
    assert.equal(command.payload.code, "Original");
  });
});
