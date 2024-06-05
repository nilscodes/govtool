import { dRep02Wallet } from "@constants/staticWallets";
import { faker } from "@faker-js/faker";
import { test } from "@fixtures/walletExtension";
import { invalid as mockInvalid } from "@mock/index";
import EditDRepPage from "@pages/editDRepPage";
import { expect } from "@playwright/test";

test.use({ wallet: dRep02Wallet, storageState: ".auth/dRep02.json" });

test.describe("Validation of edit dRep Form", () => {
  test("3M_1 Should accept valid data in edit dRep form", async ({ page }) => {
    test.slow();

    const editDRepPage = new EditDRepPage(page);
    await editDRepPage.goto();

    for (let i = 0; i < 100; i++) {
      await editDRepPage.validateForm(
        faker.internet.displayName(),
        faker.internet.email(),
        faker.lorem.paragraph(),
        faker.internet.url()
      );
    }

    for (let i = 0; i < 6; i++) {
      await expect(editDRepPage.addLinkBtn).toBeVisible();
      await editDRepPage.addLinkBtn.click();
    }

    await expect(editDRepPage.addLinkBtn).toBeHidden();
  });

  test("3M_2. Should reject invalid data in edit dRep form", async ({
    page,
  }) => {
    test.slow();

    const editDRepPage = new EditDRepPage(page);
    await editDRepPage.goto();

    for (let i = 0; i < 100; i++) {
      await editDRepPage.inValidateForm(
        mockInvalid.name(),
        mockInvalid.email(),
        faker.lorem.paragraph(40),
        mockInvalid.url()
      );
    }
  });

  test("3N_1. Should accept valid metadata anchor on edit dRep", async ({
    page,
  }) => {
    const editDRepPage = new EditDRepPage(page);
    await editDRepPage.goto();

    const dRepName = "Test_DRep";
    await editDRepPage.nameInput.fill(dRepName);

    await editDRepPage.continueBtn.click();
    await page.getByRole("checkbox").click();
    await editDRepPage.continueBtn.click();

    for (let i = 0; i < 100; i++) {
      await editDRepPage.metadataUrlInput.fill(faker.internet.url());
      await expect(page.getByTestId("invalid-url-error")).toBeHidden();
    }
  });

  test("3N_2. Should reject invalid dRep metadata anchor on edit dRep", async ({
    page,
  }) => {
    const editDRepPage = new EditDRepPage(page);
    await editDRepPage.goto();

    const dRepName = "Test_DRep";
    await editDRepPage.nameInput.fill(dRepName);

    await editDRepPage.continueBtn.click();
    await page.getByRole("checkbox").click();
    await editDRepPage.continueBtn.click();

    for (let i = 0; i < 100; i++) {
      await editDRepPage.metadataUrlInput.fill(mockInvalid.url());
      await expect(page.getByTestId("invalid-url-error")).toBeVisible();
    }

    const sentenceWithoutSpace = faker.lorem
      .sentence(128)
      .replace(/[\s.]/g, "");
    const metadataAnchorGreaterThan128Bytes =
      faker.internet.url({ appendSlash: true }) + sentenceWithoutSpace;

    await editDRepPage.metadataUrlInput.fill(metadataAnchorGreaterThan128Bytes);

    await expect(page.getByTestId("invalid-url-error")).toBeVisible();
  });
});
