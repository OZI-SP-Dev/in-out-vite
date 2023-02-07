import { ICheckListItem } from "api/CheckListItemApi";
import {
  Button,
  Tooltip,
  Spinner,
  Badge,
  Dialog,
  DialogTitle,
  DialogSurface,
  DialogContent,
  DialogActions,
} from "@fluentui/react-components";
import { useReactivateChecklistItem } from "api/ReactivateChecklistItem";
import { AlertSolidIcon } from "@fluentui/react-icons-mdl2";
import { useBoolean } from "@fluentui/react-hooks";
import { DialogFooter } from "@fluentui/react";

interface CheckListItemReactivateButtonProps {
  checklistItem: ICheckListItem;
}

export const CheckListItemReactivateButton = ({
  checklistItem,
}: CheckListItemReactivateButtonProps) => {
  const reactivateCheckListItem = useReactivateChecklistItem(checklistItem);

  /* Show the Reactivate Dialog or not */
  const [
    isReactivateDialogOpen,
    { setTrue: showReactivateDialog, setFalse: hideReactivateDialog },
  ] = useBoolean(false);

  return (
    <>
      <Button
        name="reactivationButton"
        appearance="secondary"
        onClick={showReactivateDialog}
      >
        Reactivate
      </Button>
      <Dialog open={isReactivateDialogOpen} modalType="modal">
        <DialogSurface>
          <DialogTitle>Reactivate Checklist Item?</DialogTitle>
          <DialogContent>
            Are you sure you want to reactivate this checklist item, which
            clears when and by whom it was completed, requiring it to be
            recompleted?
          </DialogContent>
          <DialogFooter>
            <DialogActions>
              {!reactivateCheckListItem.isLoading ? (
                <Button
                  appearance="secondary"
                  onClick={() => reactivateCheckListItem.mutate()}
                >
                  Yes, reactivate
                </Button>
              ) : (
                <Spinner
                  style={{ justifyContent: "flex-start" }}
                  size="small"
                  label="Reactivating..."
                />
              )}
              {reactivateCheckListItem.isError && (
                <Tooltip
                  content={
                    reactivateCheckListItem.error instanceof Error
                      ? reactivateCheckListItem.error.message
                      : "An error occurred."
                  }
                  relationship="label"
                >
                  <Badge
                    size="extra-large"
                    appearance="ghost"
                    color="danger"
                    style={{ verticalAlign: "middle" }}
                    icon={<AlertSolidIcon />}
                  />
                </Tooltip>
              )}
              <Button appearance="primary" onClick={hideReactivateDialog}>
                No, take me back safely
              </Button>
            </DialogActions>
          </DialogFooter>
        </DialogSurface>
      </Dialog>
    </>
  );
};
