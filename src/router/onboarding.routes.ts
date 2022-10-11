import PartnerSignUp from "@/views/onboarding/PartnerSignUp.vue";
import GetStarted from "@/views/onboarding/GetStarted.vue";
import citySelection from "@/views/onboarding/CitySelection.vue";
import UserSelection from "@/views/app/OrganizationSelection.vue";

export const OnboardRoutes: Array<any> = [
  {
    path: "/welcome",
    name: "PartnerSignUp",
    component: PartnerSignUp,
    meta: {
      title: "PartnerSignUp",
      requiresAuth: true,
      isOnboardingRoute: true
    },
  },
  {
    path: "/get-started/:type?",
    name: "GetStarted",
    component: GetStarted,
    meta: {
      title: "GetStarted",
      requiresAuth: true,
      isOnboardingRoute: true
    },
  },
  {
    path: "/city-selection",
    name: "citySelection",
    component: citySelection,
    meta: {
      title: "GetStarted",
      requiresAuth: true,
      isOnboardingRoute: true
    },
  },
];
