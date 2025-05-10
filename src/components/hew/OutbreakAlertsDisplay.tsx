"use client";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import type { Report } from "@/lib/types";

interface OutbreakAlertsDisplayProps {
  reports: Report[];
}

interface SimulatedAlert {
  id: string;
  title: string;
  description: string;
  type: "warning" | "info" | "critical";
}

export function OutbreakAlertsDisplay({ reports }: OutbreakAlertsDisplayProps) {
  const [alerts, setAlerts] = useState<SimulatedAlert[]>([]);

  useEffect(() => {
    const newAlerts: SimulatedAlert[] = [];

    // Example condition: More than 1 Cholera report
    const choleraReports = reports.filter(
      (r) => r.suspectedDisease.toLowerCase() === "cholera"
    ).length;
    if (choleraReports > 0) {
      // Changed from 1 to 0 to show alert with sample data
      newAlerts.push({
        id: "cholera-alert",
        title: "Cholera Alert!",
        description: `Increased reports of Cholera (${choleraReports} case(s)) detected in your area. Ensure hygiene protocols are followed. Boil drinking water.`,
        type: "critical",
      });
    }

    // Example condition: Any Measles report
    const measlesReports = reports.filter(
      (r) => r.suspectedDisease.toLowerCase() === "measles"
    ).length;
    if (measlesReports > 0) {
      newAlerts.push({
        id: "measles-alert",
        title: "Measles Case Reported",
        description:
          "A suspected case of Measles has been reported. Encourage vaccination and monitor for symptoms in the community.",
        type: "warning",
      });
    }

    // General health instruction (always show if no critical alerts)
    if (newAlerts.filter((a) => a.type === "critical").length === 0) {
      newAlerts.push({
        id: "general-info",
        title: "Health Advisory",
        description:
          "Remember to promote handwashing and safe food practices in your community. Report any unusual symptoms promptly.",
        type: "info",
      });
    }

    setAlerts(newAlerts);
  }, [reports]);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-6">
      {alerts.map(
        (alert) =>
          alert && (
            <Alert
              key={alert.id}
              variant={
                alert.type === "critical" || alert.type === "warning"
                  ? "destructive"
                  : "default"
              }
              className={`${
                alert.type === "critical"
                  ? "border-destructive bg-destructive/10"
                  : alert.type === "warning"
                  ? "border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-500"
                  : "border-primary bg-primary/10"
              }`}
            >
              {alert.type === "critical" || alert.type === "warning" ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <Info className="h-5 w-5" />
              )}
              <AlertTitle
                className={
                  alert.type === "critical"
                    ? "text-destructive"
                    : alert.type === "warning"
                    ? "text-yellow-700 dark:text-yellow-400"
                    : "text-primary"
                }
              >
                {alert.title}
              </AlertTitle>
              <AlertDescription
                className={
                  alert.type === "warning"
                    ? "text-yellow-600 dark:text-yellow-300"
                    : ""
                }
              >
                {alert.description}
              </AlertDescription>
            </Alert>
          )
      )}
    </div>
  );
}
