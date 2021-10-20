'use strict'
import SubmitController from './utility/SubmitController.js';

const cargoModel = new Cargo();
const submitController = new SubmitController($('.control-button'));
let cargoTable = null;

async function initAddForm () {
  const form = window.document.querySelector('#cargo-add-form');
  const submitButton = document.querySelector('.control-button');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (e.submitter !== submitButton) {
      return;
    }

    if (!submitController.submitReady) {
      return;
    }

    const formData = new FormData(e.target);
    const cargoData = {};
    formData.forEach((value, key) => {
      cargoData[key] = value
    });

    try {
      if (submitController.action === SubmitController.actions.addRow) {
        await cargoModel.Create(cargoData);
      } else if (submitController.action === SubmitController.actions.editRow) {
        const {rowIndex, rowId} = submitController.payload;

        await cargoModel.Update(rowId, cargoData);

        cargoTable.row(rowIndex).data({_id: rowId, ...cargoData}).draw();
      }
    } catch (e) {
      console.error(e);
    }
    finally {
      submitController.SetCreateState();
    }

    e.target.reset();
  })
}

async function initList () {
  const tableData = await cargoModel.Select();

  cargoTable = window.jQuery('#cargo-list').DataTable({
    data: tableData,
    columns: [
      { title: 'ID', data: '_id' },
      { title: 'Code', data: 'code' },
      { title: 'Name', data: 'name' },
      { title: 'Weight', data: 'weight' },
      { title: 'To planet', data: 'planetDestination' },
      { title: 'To station', data: 'stationDestination' },
      { title: 'Controls',
        render: () => `<button action="delete" class="btn btn-danger">Delete</button>
                       <button action="edit" class="btn btn-success">Edit</button>`
      },
    ]
  });

  $('.control-button').on('click', function () {
    submitController.submitReady = true;
  });

  $('#cargo-list').on('click', 'tbody tr button[action="delete"]', async function(event){
    const rowToDelete = $(event.target).closest('tr');
    const rowId = rowToDelete.children(":first").text();

    try {
      await cargoModel.Delete(rowId);
      cargoTable.row(rowToDelete).remove().draw();
    } catch (e) {
      console.log(e);
    }
  });

  $('#cargo-list').on('click', 'tbody tr button[action="edit"]', async function(event){
    const rowNode = $(event.target).closest('tr');
    const rowId = rowNode.children(":first").text();

    const rowToEdit = cargoTable.row(rowNode);

    const elementToEdit = await cargoModel.FindById(rowId);
    document.getElementById("code").value = elementToEdit.code;
    document.getElementById("name").value = elementToEdit.name;
    document.getElementById("weight").value = elementToEdit.weight;
    document.getElementById("planetDestination").value = elementToEdit.planetDestination;
    document.getElementById("stationDestination").value = elementToEdit.stationDestination;

    submitController.SetEditState({
      rowIndex: rowToEdit.index(),
      rowId,
    });
  });
}

function initListEvents () {
  document.addEventListener('cargoesListDataChanged', function (e) {
    const dataTable = window.jQuery('#cargo-list').DataTable();

    dataTable.clear();
    dataTable.rows.add(e.detail);
    dataTable.draw();
  }, false)
}

window.addEventListener('DOMContentLoaded', async e => {
  await initAddForm();
  await initList();
  initListEvents();
});
