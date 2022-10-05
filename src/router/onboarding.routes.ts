import PartnerSignUp from "@/views/onboarding/PartnerSignUp.vue";

export const OnboardRoutes: Array<any> = [
  {
    path: "/PartnerSignUp",
    name: "PartnerSignUp",
    component: PartnerSignUp,
    meta: {
      title: "PartnerSignUp",
      requiresAuth: true,
    },
  },
];
