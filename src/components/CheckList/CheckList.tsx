import { useChecklistItems } from "api/CheckListItemApi";
import {
  IColumn,
  SelectionMode,
  ShimmeredDetailsList,
  Selection,
} from "@fluentui/react";
import { FunctionComponent, useState } from "react";
import { Link } from "@fluentui/react-components";
import { useBoolean } from "@fluentui/react-hooks";
import { CheckListItemPanel } from "components/CheckList/CheckListItemPanel";
import { RoleType } from "api/RolesApi";
import { IInRequest } from "api/RequestApi";
import { CheckListItemButton } from "components/CheckList/CheckListItemButton";

export interface ICheckList {
  ReqId: number;
  Roles: RoleType[];
  Request: IInRequest;
}

export const CheckList: FunctionComponent<ICheckList> = (props) => {
  const checlistItems = useChecklistItems(Number(props.ReqId));

  // State and functions to handle whether or not to display the CheckList Item Panel
  const [isItemPanelOpen, { setTrue: showItemPanel, setFalse: hideItemPanel }] =
    useBoolean(false);

  // The selected CheckList Item
  let selection = new Selection();

  // State and function to handle which item is being displayed in the CheckList Item Panel
  const [currentItemId, setCurrentItemId] = useState<number>();

  // The currently selected CheckList Item
  const currentItem = checlistItems.data?.find(
    (item) => item.Id === currentItemId
  );

  // Define columns for details list
  const columns: IColumn[] = [
    {
      key: "column0",
      name: "Item",
      fieldName: "Id",
      minWidth: 40,
      maxWidth: 40,
      isResizable: false,
    },
    {
      key: "column1",
      name: "Title",
      fieldName: "Title",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => (
        <Link
          onClick={() => {
            setCurrentItemId(item.Id);
            showItemPanel();
          }}
        >
          {item.Title}
        </Link>
      ),
    },
    {
      key: "column2",
      name: "Lead",
      fieldName: "Lead",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "column3",
      name: "Completed Date",
      fieldName: "CompletedDate",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => {
        if (item.CompletedDate) {
          return <>{item.CompletedDate?.toFormat("yyyy-MM-dd")}</>;
        } else {
          // TODO: Replace this button with a Command Bar at the top of the ShimmeredDetailList
          return (
            // Show the button to complete if they are the proper role AND the request is Active
            props.Roles?.includes(item.Lead) &&
            props.Request.status === "Active" && (
              <CheckListItemButton checklistItem={item} />
            )
          );
        }
      },
    },
    {
      key: "column4",
      name: "Completed By",
      fieldName: "CompletedBy",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => {
        return <>{item.CompletedBy?.Title}</>;
      },
    },
  ];

  return (
    <>
      <ShimmeredDetailsList
        setKey="Id"
        items={checlistItems.data || []}
        columns={columns}
        enableShimmer={!checlistItems.data}
        selectionMode={SelectionMode.single}
        onActiveItemChanged={(item) => {
          setCurrentItemId(item.Id);
        }}
        onItemInvoked={showItemPanel}
        selection={selection}
      />
      {currentItem && (
        <CheckListItemPanel
          isOpen={isItemPanelOpen}
          onDismiss={hideItemPanel}
          item={currentItem}
          roles={props.Roles}
          request={props.Request}
        ></CheckListItemPanel>
      )}
    </>
  );
};
