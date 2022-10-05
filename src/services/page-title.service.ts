import { RouteLocationNormalized, Router } from 'vue-router';

export class PageTitleService {
  private DEFAULT_TITLE = 'Shuttlers Vehicle Partner';

  constructor (private router: Router) {
  }

  initializeRouteListener (): void {
    this.router.afterEach((route: RouteLocationNormalized) => {
      let title: string = this.DEFAULT_TITLE;
      if (route.meta?.title) {
        title = route.meta?.title + ' - Vehicle Partner';
      }
      document.title = title;
    });
  }
}
