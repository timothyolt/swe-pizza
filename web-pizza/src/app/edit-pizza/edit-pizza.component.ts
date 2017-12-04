import { Component, Input, OnInit } from '@angular/core';
import { Pizza } from '../../models/pizza';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take'
/** Allow jQuery to work */
declare var $;

/** Setup Angular component structure */
@Component({
  selector: 'app-edit-pizza',
  templateUrl: './edit-pizza.component.html',
  styleUrls: ['./edit-pizza.component.css']
})
export class EditPizzaComponent implements OnInit {
  /** Get Pizza from HTML property */
  @Input() pizza = new Pizza();
  /** Observable list of ItemCatagory snapshots */
  itemCatSnapshots: Observable<SnapshotAction[]>;
  /** Observable list of ItemType snapshots */
  itemTypeSnapshots: Observable<SnapshotAction[]>;
  /** Data-bound inputed name of pizza */
  pizzaName: string;
  /** Data-bound css value for success banner */
  showSuccess = 'none';
  /** Data-bound css value for warning banner */
  showWarning = 'none';

  /** Initalize AngularFireDatabase */
  constructor(private db: AngularFireDatabase) { }

  /**
   * Fetch ItemCatagory and ItemType and setup UI based on values
   * 
   * Called when Angular is ready
   */
  ngOnInit() {
    this.itemCatSnapshots = this.db.list('/itemCat').snapshotChanges().take(1);
    this.itemTypeSnapshots = this.db.list('/itemType').snapshotChanges().take(1);

    this.itemCatSnapshots.subscribe(cat => {
      this.itemTypeSnapshots.subscribe(type => {
        $(document).ready(() => {
          this.db.object('/defaultPizza').query.ref.once('value', defaultPizza => {
            this.pizza.name = defaultPizza.val().name;
          }).then(objects => {
            objects.forEach((object) => {
              if (object.key !== 'name') {
                const key = object.key;
                // Check if topping is non-exclusive
                if (object.val() instanceof Object) {
                  // for subjson(non-exclusive)
                  let subkey = Object.keys(object.val())[0];
                  $(`#${subkey}`).prop('checked', true);
                } else {
                  //for string(exclusive)
                  $(`#${object.val()}`).prop('checked', true);
                }
              }
            });
          });
        });
      });
    });
  }

  /** Save default pizza config */
  save() {
    this.showSuccess = 'none';
    this.showWarning = 'none';
    let dataToSave: any = { 'name': this.pizza.name };

    $(document).ready(() => {
      // Loop through each input and get it's values and add it to dataToSave
      $('#form-wrapper :input').each(function () {
        if ($(this).prop('checked')) {
          let key = $(this).attr('id');
          let cat = $(this).attr('data-cat');

          if ($(this).attr('data-exclusive') === 'true') {
            $.extend(dataToSave, {
              [cat]: key
            });
          } else {
            if (dataToSave[cat]) {
              $.extend(dataToSave[cat], {
                [key]: true
              });
            } else {
              dataToSave[cat] = { [key]: true };
            }
          }
        }
      });

      console.log('JSON: ' + JSON.stringify(dataToSave));
      // Save and display banner based on response
      this.db.object('/defaultPizza').set(dataToSave).then(() => {
        this.showSuccess = 'block';
      }, () => {
        this.showWarning = 'block';
      });
    });
  }

}
