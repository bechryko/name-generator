/**
 * An interface for the sidebar's menu item.
 */
export interface NgenSidebarSelectable<T> {
   /**
    * The displayed text of the item.
    */
   label: string;
   /**
    * Appears as a tooltip of the item. If omitted, no tooltip appears.
    */
   description?: string;
   /**
    * The emitted value when the given item is selected.
    */
   value: T;
}
