import type { AdminIdentity } from "./lib/admin/auth";

declare global {
  namespace App {
    interface Locals {
      admin?: AdminIdentity;
    }
  }
}

export {};
