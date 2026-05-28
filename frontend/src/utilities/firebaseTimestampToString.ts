interface FirebaseTimestamp {
  toDate?: () => Date;
  toMillis?: () => number;
  seconds?: number;
  nanoseconds?: number;
}

// Takes a Firebase Timestamp, FieldValue placeholder, or string and returns a readable string.
export const firebaseTimestampToString = (value: unknown): string => {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as FirebaseTimestamp).toDate === "function"
  ) {
    const fn = (value as FirebaseTimestamp).toDate;
    if (typeof fn === "function") return fn.call(value).toLocaleDateString();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toMillis" in value &&
    typeof (value as FirebaseTimestamp).toMillis === "function"
  ) {
    const fn = (value as FirebaseTimestamp).toMillis;
    if (typeof fn === "function")
      return new Date(fn.call(value)).toLocaleDateString();
  }

  // Handle Firestore's plain JSON representation: { seconds: number, nanoseconds: number }
  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    "nanoseconds" in value
  ) {
    const anyVal = value as {
      seconds: unknown;
      nanoseconds: unknown;
    };
    const secs = Number(anyVal.seconds);
    const nanos = Number(anyVal.nanoseconds);
    if (!Number.isNaN(secs) && !Number.isNaN(nanos)) {
      return new Date(
        secs * 1000 + Math.floor(nanos / 1e6),
      ).toLocaleDateString();
    }
  }

  return String(value);
};
