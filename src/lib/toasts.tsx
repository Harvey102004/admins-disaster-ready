import { toast } from "sonner";

// ----------- DELETE CONFIRMATION --------- //

export const showDeleteConfirmation = ({
  onConfirm,
  onClose,
  margins,
}: {
  onConfirm: () => void;
  onClose: () => void;
  margins?: string;
}) => {
  toast.warning("Are you sure?", {
    id: "confirm-delete",
    description: "This will deleted permanently",
    style: { marginLeft: margins },
    action: {
      label: (
        <div className="ml-2 flex items-center gap-1">
          <span
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-sm border border-red-500 px-3 py-1 text-xs text-red-500 hover:opacity-80"
          >
            Yes
          </span>
          <span
            onClick={() => {
              toast.dismiss();
              onClose();
            }}
            className="rounded-sm border bg-red-500 px-3 py-1 text-xs"
          >
            No
          </span>
        </div>
      ),
      onClick: () => {
        console.log("sample");
      },
    },
  });
};

// ----------- EDIT CONFIRMATION --------- //

export const showEditConfirmation = ({
  onConfirm,
}: {
  onConfirm: () => void;
}) => {
  toast.info("Are you sure?", {
    id: "confirm-edit",
    description: "Your changes will replace the current data.",
    action: {
      label: (
        <div className="ml-2 flex items-center gap-1">
          <span
            onClick={onConfirm}
            className="border-dark-blue text-dark-blue rounded-sm border px-3 py-1 text-xs hover:opacity-80"
          >
            Yes
          </span>
          <span
            onClick={() => {
              toast.dismiss();
            }}
            className="bg-dark-blue rounded-sm border px-3 py-1 text-xs"
          >
            No
          </span>
        </div>
      ),
      onClick: () => {
        console.log("sample");
      },
    },
  });
};
