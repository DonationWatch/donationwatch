import { PageObject } from "../util/page";

export class EnterprisePage extends PageObject {
  public readonly heading = this.page.getByRole("heading", {
    name: this.translations("enterprise.heading"),
  });

  public readonly formTitle = this.page.getByRole("heading", {
    name: this.translations("enterprise.form.formTitle"),
  });

  public readonly fullNameInput = this.page.getByLabel(
    this.translations("enterprise.form.labelFullName"),
  );

  public readonly workEmailInput = this.page.getByLabel(
    this.translations("enterprise.form.labelWorkEmail"),
  );

  public readonly organizationInput = this.page.getByLabel(
    this.translations("enterprise.form.labelOrganization"),
  );

  public readonly queryRequestInput = this.page.getByLabel(
    this.translations("enterprise.form.labelQueryRequest"),
  );

  public readonly submitButton = this.page.getByRole("button", {
    name: this.translations("enterprise.form.buttonSubmit"),
  });
}
