'use strict'
import SubmitController from './utility/SubmitController.js';

const planetModel = new Planet();
const submitController = new SubmitController($('.control-button'));
let planetTable = null;

async function initAddForm () {
  const form = window.document.querySelector('#planet-add-form');
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
    const planetData = {};
    formData.forEach((value, key) => {
      planetData[key] = value
    });

    try {
      if (submitController.action === SubmitController.actions.addRow) {
        await planetModel.Create(planetData);
      } else if (submitController.action === SubmitController.actions.editRow) {
        const {rowIndex, rowId} = submitController.payload;

        await planetModel.Update(rowId, planetData);

        planetTable.row(rowIndex).data({_id: rowId, ...planetData}).draw();
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
  const tableData = await planetModel.Select();

  planetTable = window.jQuery('#planet-list').DataTable({
    data: tableData,
    columns: [
      { title: 'ID', data: '_id' },
      { title: 'Name', data: 'name' },
      { title: 'Weight', data: 'weight' },
      { title: 'Storage', data: 'storage' },
      { title: 'Controls',
        render: () => `<button action="delete" class="btn btn-danger">Delete</button>
                       <button action="edit" class="btn btn-success">Edit</button>`
      },
    ]
  });

  $('.control-button').on('click', function () {
    submitController.submitReady = true;
  });

  $('#planet-list').on('click', 'tbody tr button[action="delete"]', async function(event){
    const rowToDelete = $(event.target).closest('tr');
    const rowId = rowToDelete.children(":first").text();

    try {
      await planetModel.Delete(rowId);
      planetTable.row(rowToDelete).remove().draw();
    } catch (e) {
      console.log(e);
    }
  });

  $('#planet-list').on('click', 'tbody tr button[action="edit"]', async function(event){
    const rowNode = $(event.target).closest('tr');
    const rowId = rowNode.children(":first").text();

    const rowToEdit = planetTable.row(rowNode);

    const elementToEdit = await planetModel.FindById(rowId);
    document.getElementById("name").value = elementToEdit.name;
    document.getElementById("weight").value = elementToEdit.weight;
    document.getElementById("storage").value = elementToEdit.storage;

    submitController.SetEditState({
      rowIndex: rowToEdit.index(),
      rowId,
    });
  });
}

function initListEvents () {
  document.addEventListener('planetsListDataChanged', function (e) {
    const dataTable = window.jQuery('#planet-list').DataTable();

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
