import { Dialog } from "dialog";
import { useRef, useState } from "react";

type DialogID = "add-delivery-address" | "verification-result";

export default function Web() {
  const [stack, setStack] = useState<DialogID[]>([]);

  const push = (newStack: DialogID) => () => setStack(stack.concat(newStack));
  const pop = () => setStack(stack.slice(0, -1));

  return (
    <div className="h-screen w-screen grid place-content-center bg-gray-200">
      <button type="button" onClick={push("add-delivery-address")}>
        Add Delivery Address
      </button>

      {stack.includes("add-delivery-address") && (
        <AddDeliveryAddress pop={pop} push={push} />
      )}

      {stack.includes("verification-result") && (
        <VerificationResult pop={pop} />
      )}
    </div>
  );
}

type ModalProps = {
  pop?: () => void;
  push?: (stack: DialogID) => () => void;
};
function AddDeliveryAddress(props: ModalProps) {
  return (
    <Dialog
      onDismiss={props.pop}
      className={[
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "bg-white shadow p-8",
      ].join(" ")}
    >
      <Dialog.Backdrop>
        <div className="fixed bg-red-200 inset-0" />
      </Dialog.Backdrop>

      <Dialog.Title className="text-blue-800 text-2xl text-center mb-4">
        Add Delivery Address
      </Dialog.Title>

      <form>
        <div>
          <label>
            <strong>Street:</strong>
            <input type="text" className="border border-black w-full" />
          </label>
        </div>

        <div>
          <label>
            <strong>City:</strong>
            <input type="text" className="border border-black w-full" />
          </label>
        </div>

        <div>
          <label>
            <strong>State:</strong>
            <input type="text" className="border border-black w-full" />
          </label>
        </div>

        <div>
          <label>
            <strong>Zip:</strong>
            <input type="text" className="border border-black w-full" />
          </label>
        </div>

        <div>
          <label htmlFor="special_instructions">
            <strong>Special instructions:</strong>
          </label>
          <input
            id="special_instructions"
            type="text"
            aria-describedby="special_instructions_desc"
            className="border border-black w-full"
          />
          <div>
            For example, gate code or other information to help the driver find
            you
          </div>
        </div>
      </form>

      <div className="mt-4 gap-2 flex justify-end">
        <button
          type="button"
          className="bg-blue-900 text-white px-3 py-1"
          onClick={props.push?.("verification-result")}
        >
          Verify Address
        </button>
        <button type="button" className="bg-green-600 text-white px-3 py-1">
          Add
        </button>
        <button
          type="button"
          className="bg-red-600 text-white px-3 py-1"
          onClick={props.pop}
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
}

function VerificationResult(props: ModalProps) {
  const ref = useRef(null);
  return (
    <Dialog
      initialFocusRef={ref}
      className={[
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "bg-white shadow p-8",
        "max-h-[60vh] overflow-auto",
      ].join(" ")}
      onDismiss={props.pop}
    >
      <Dialog.Backdrop>
        <div className="fixed backdrop-blur inset-0" />
      </Dialog.Backdrop>

      <Dialog.Title className="text-blue-800 text-2xl text-center mb-4">
        Verification Result
      </Dialog.Title>
      <div className="text-lg">
        <p tabIndex={-1} ref={ref}>
          This is just a demonstration. If it were a real application, it would
          provide a message telling whether the entered address is valid.
        </p>
        <p>
          For demonstration purposes, this dialog has a lot of text. It
          demonstrates a scenario where:
        </p>
        <ul>
          <li>
            The first interactive element, the help link, is at the bottom of
            the dialog.
          </li>
          <li>
            If focus is placed on the first interactive element when the dialog
            opens, the validation message may not be visible.
          </li>
          <li>
            If the validation message is visible and the focus is on the help
            link, then the focus may not be visible.
          </li>
          <li>
            When the dialog opens, it is important that both:
            <ul>
              <li>
                The beginning of the text is visible so users do not have to
                scroll back to start reading.
              </li>
              <li>The keyboard focus always remains visible.</li>
            </ul>
          </li>
        </ul>
        <p>There are several ways to resolve this issue:</p>
        <ul>
          <li>
            Place an interactive element at the top of the dialog, e.g., a
            button or link.
          </li>
          <li>
            Make a static element focusable, e.g., the dialog title or the first
            block of text.
          </li>
        </ul>
        <p>
          Please <em>DO NOT </em> make the element with role dialog focusable!
        </p>
        <ul>
          <li>
            The larger a focusable element is, the more difficult it is to
            visually identify the location of focus, especially for users with a
            narrow field of view.
          </li>
          <li>
            The dialog has a visual border, so creating a clear visual indicator
            of focus when the entire dialog has focus is not very feasible.
          </li>
          <li>
            Screen readers read the label and content of focusable elements. The
            dialog contains its label and a lot of content! If a dialog like
            this one has focus, the actual focus is difficult to comprehend.
          </li>
        </ul>
        <p>
          In this dialog, the first paragraph has{" "}
          <code>
            tabindex=<q>-1</q>
          </code>
          . The first paragraph is also contained inside the element that
          provides the dialog description, i.e., the element that is referenced
          by <code>aria-describedby</code>. With some screen readers, this may
          have one negative but relatively insignificant side effect when the
          dialog opens -- the first paragraph may be announced twice.
          Nonetheless, making the first paragraph focusable and setting the
          initial focus on it is the most broadly accessible option.
        </p>
      </div>
      <div className="mt-4 gap-2 flex justify-end">
        <a href="#" className="text-blue-700 px-3 py-1">
          link to help
        </a>
        <button type="button" className="bg-green-600 text-white px-3 py-1">
          accepting an alternative form
        </button>
        <button
          type="button"
          className="bg-red-600 text-white px-3 py-1"
          onClick={props.pop}
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}
