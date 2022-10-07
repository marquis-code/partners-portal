import PartnerSignUp from "@/views/onboarding/PartnerSignUp.vue";
import GetStarted from "@/views/onboarding/GetStarted.vue";

export const OnboardRoutes: Array<any> = [
  {
    path: "/sign-up",
    name: "PartnerSignUp",
    component: PartnerSignUp,
    meta: {
      title: "PartnerSignUp",
      requiresAuth: false,
    },
  },
  {
    path: "/get-started",
    name: "GetStarted",
    component: GetStarted,
    meta: {
      title: "GetStarted",
      requiresAuth: false,
    },
  },
];
