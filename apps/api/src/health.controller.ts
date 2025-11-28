import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  health() {
    return {
      status: "ok",
      service: "etrna-api",
      message: "Baseline scaffolding for entitlements, rewards, and UEF services"
    };
  }
}
