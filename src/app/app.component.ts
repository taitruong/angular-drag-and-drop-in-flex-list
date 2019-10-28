import { Component } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {

  timePeriods = ["1", "2", "3", "4", "5", "6", "7"];
  itemsTable: Array<string[]>;

  getItemsTable(rowLayout: Element): string[][] {
    if (this.itemsTable) {
      return this.itemsTable;
    }
    // calculate column size per row
    const { width } = rowLayout.getBoundingClientRect();
    const boxWidth = Math.round(width * .33); // 33% as defined in css
    const columnSize = Math.round(width / boxWidth);

    // calculate row size: items length / column size
    // add 0.5: round up so that last element is shown in next row
    const rowSize = Math.round(this.timePeriods.length / columnSize + .5);

    // create table rows
    const copy = [...this.timePeriods];
    this.itemsTable = Array(rowSize)
      .fill("")
      .map(
        _ =>
          Array(columnSize) // always fills to end of column size, therefore...
            .fill("")
            .map(_ => copy.shift())
            .filter(item => !!item) // ... we need to remove empty items
      );
    return this.itemsTable;
  }

  reorderDroppedItem(event: CdkDragDrop<number[]>) {
    // clone table, since it needs to be re-initialized after dropping
    let copyTableRows = this.itemsTable.map(_ => _.map(_ => _));

    // drop item
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // update items after drop
    this.timePeriods = this.itemsTable.reduce((previous, current) =>
      previous.concat(current)
    );

    // re-initialize table
    let index = 0;
    this.itemsTable = copyTableRows.map(row =>
      row.map(_ => this.timePeriods[index++])
    );
  }

}
