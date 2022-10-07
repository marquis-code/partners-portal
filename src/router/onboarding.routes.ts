import PartnerSignUp from "@/views/onboarding/PartnerSignUp.vue";
import GetStarted from "@/views/onboarding/GetStarted.vue";
import citySelection from "@/views/onboarding/CitySelection.vue";

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
  {
    path: "/city-selection",
    name: "citySelection",
    component: citySelection,
    meta: {
      title: "GetStarted",
      requiresAuth: false,
    },
  },
];
