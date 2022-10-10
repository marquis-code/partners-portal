import PartnerSignUp from "@/views/onboarding/PartnerSignUp.vue";
import GetStarted from "@/views/onboarding/GetStarted.vue";
import citySelection from "@/views/onboarding/CitySelection.vue";
import UserSelection from "@/views/onboarding/UserSelection.vue";

export const OnboardRoutes: Array<any> = [
  {
    path: "/sign-up",
    name: "PartnerSignUp",
    component: PartnerSignUp,
    meta: {
      title: "PartnerSignUp",
      requiresAuth: true,
    },
  },
  {
    path: "/get-started/:type?",
    name: "GetStarted",
    component: GetStarted,
    meta: {
      title: "GetStarted",
      requiresAuth: true,
    },
  },
  {
    path: "/city-selection",
    name: "citySelection",
    component: citySelection,
    meta: {
      title: "GetStarted",
      requiresAuth: true,
    },
  },
  {
    path: "/user-selection",
    name: "UserSelection",
    component: UserSelection,
    meta: {
      title: "UserSelection",
      requiresAuth: true,
    },
  },
];
