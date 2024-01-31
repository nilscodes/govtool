import { ComponentProps, useEffect } from "react";
import { Story, Meta, StoryFn } from "@storybook/react";

import { Modal } from "@atoms";
import { ExternalLinkModal, ExternalLinkModalState } from "@organisms";
import { ModalProvider, useModal } from "../../context/modal";
import { userEvent, within, screen, waitFor } from "@storybook/testing-library";
import { expect, jest } from "@storybook/jest";

const meta = {
  title: "Example/Modals/ExternalLinkModal",
  component: ExternalLinkModal,
  decorators: [
    (Story) => (
      <ModalProvider>
        <Story />
      </ModalProvider>
    ),
  ],
} satisfies Meta<typeof ExternalLinkModal>;

export default meta;

const Template: StoryFn<ExternalLinkModalState> = (args) => {
  const { openModal, modal, closeModal } = useModal();

  const open = () => {
    openModal({
      type: "externalLink",
      state: { externalLink: args.externalLink },
    });
  };

  useEffect(() => {
    open();
  }, [openModal]);

  return (
    <>
      <button onClick={open} style={{ cursor: "pointer" }}>
        Open Modal
      </button>
      {modal?.component && (
        <Modal
          open={Boolean(modal.component)}
          handleClose={!modal.preventDismiss ? closeModal : undefined}
        >
          {modal.component}
        </Modal>
      )}
    </>
  );
};

export const Default = Template.bind({});

Default.args = {
  externalLink: "https://www.google.com/",
};

Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  waitFor(async () => {
    const modalScreen = screen.getAllByTestId("external-link-modal")[0];
    let modalCanvas = within(modalScreen);
    window.open = jest.fn();

    expect(modalCanvas.getByText(/Be Careful!/i)).toBeInTheDocument();
    expect(
      modalCanvas.getByText("https://www.google.com/")
    ).toBeInTheDocument();

    await userEvent.click(modalCanvas.getByTestId("continue-modal-button"));
    expect(screen.queryAllByTestId("external-link-modal")).toHaveLength(0); // checking id modal is closed
    expect(window.open).toBeCalledTimes(1);
    expect(screen.queryAllByTestId("external-link-modal")).toHaveLength(0); // checking id modal is closed

    // Validating close modal
    await userEvent.click(canvas.getByRole("button"));
    modalCanvas = within(screen.getAllByTestId("external-link-modal")[0]);
    await userEvent.click(modalCanvas.getByTestId("cancel-modal-button"));
    expect(screen.queryAllByTestId("external-link-modal")).toHaveLength(0); // checking id modal is closed

    await userEvent.click(canvas.getByRole("button"));
    modalCanvas = within(screen.getAllByTestId("external-link-modal")[0]);
    await userEvent.click(modalCanvas.getByTestId("close-modal-button"));
    expect(screen.queryAllByTestId("external-link-modal")).toHaveLength(0); // checking id modal is closed
  });
};