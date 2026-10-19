"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "./ConsentProvider";
import { trackLead } from "./tracker";

/**
 * Fires the consultation-request conversion once per view of /blagodarim (FR-28), and only
 * with marketing consent. Sends no data about the request. Renders nothing.
 */
export function Conversion() {
  const { consent } = useConsent();
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || consent?.marketing !== true) return;
    sent.current = true;
    trackLead();
  }, [consent]);

  return null;
}
