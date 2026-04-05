import { ObjectId } from "mongodb";
import { getDatabase } from "@/app/lib/mongodb";
import type { NewTestimonyInput, TestimonyRecord } from "@/app/lib/testimony-types";

type TestimonyDocument = {
  _id?: ObjectId;
  fullName: string;
  phone: string | null;
  location: string | null;
  session: string | null;
  testimony: string;
  consentToShare: boolean;
  anonymousMode: boolean;
  createdAt: Date;
};

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
}

function normalizeRequiredString(value: unknown, fieldName: string) {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} is required.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function serializeTestimony(testimony: TestimonyDocument & { _id: ObjectId }): TestimonyRecord {
  const anonymousMode = testimony.anonymousMode === true;

  return {
    id: testimony._id.toHexString(),
    fullName: testimony.fullName,
    phone: testimony.phone,
    location: testimony.location,
    session: testimony.session,
    testimony: testimony.testimony,
    consentToShare: testimony.consentToShare,
    anonymousMode,
    createdAt: testimony.createdAt.toISOString(),
  };
}

function serializePublicTestimony(testimony: TestimonyDocument & { _id: ObjectId }): TestimonyRecord {
  const base = serializeTestimony(testimony);

  if (base.anonymousMode) {
    return {
      ...base,
      fullName: "Anonymous",
      phone: null,
      location: null,
    };
  }

  return {
    ...base,
    phone: null,
  };
}

export function parseTestimonyInput(input: unknown): NewTestimonyInput {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid testimony payload.");
  }

  const payload = input as Record<string, unknown>;
  const fullName = normalizeRequiredString(payload.fullName, "Full name");
  const testimony = normalizeRequiredString(payload.testimony, "Testimony");

  return {
    fullName,
    phone: normalizeOptionalString(payload.phone) ?? undefined,
    location: normalizeOptionalString(payload.location) ?? undefined,
    session: normalizeOptionalString(payload.session) ?? undefined,
    testimony,
    consentToShare: payload.consentToShare === true,
    anonymousMode: payload.anonymousMode === true,
  };
}

async function getCollection() {
  const db = await getDatabase();
  return db.collection<TestimonyDocument>("testimonies");
}

export async function createTestimony(input: NewTestimonyInput) {
  const collection = await getCollection();
  const testimony: TestimonyDocument = {
    fullName: input.fullName,
    phone: input.phone?.trim() || null,
    location: input.location?.trim() || null,
    session: input.session?.trim() || null,
    testimony: input.testimony.trim(),
    consentToShare: input.consentToShare,
    anonymousMode: input.anonymousMode,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(testimony);

  return serializeTestimony({
    ...testimony,
    _id: result.insertedId,
  });
}

export async function getPublicTestimonies() {
  const collection = await getCollection();
  const testimonies = await collection
    .find({
      consentToShare: true,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return testimonies
    .filter((testimony): testimony is TestimonyDocument & { _id: ObjectId } => Boolean(testimony._id))
    .map(serializePublicTestimony);
}
