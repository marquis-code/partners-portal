export class UnAuthorizedAccessError {
  constructor (error: unknown) {
    console.info('User is not authorized to access this resource', error);
  }
}
