import PartnerSignUp from "@/views/onboarding/PartnerSignUp.vue";

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
];
