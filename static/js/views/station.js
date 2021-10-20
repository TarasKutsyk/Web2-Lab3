'use strict'
import SubmitController from './utility/SubmitController.js';

const stationModel = new SpaceStation();
const submitController = new SubmitController($('.control-button'));
let stationTable = null;

async function initAddForm () {
  const form = window.document.querySelector('#station-add-form');
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
    const stationData = {};
    formData.forEach((value, key) => {
      stationData[key] = value
    });

    try {
      if (submitController.action === SubmitController.actions.addRow) {
        await stationModel.Create(stationData);
      } else if (submitController.action === SubmitController.actions.editRow) {
        const {rowIndex, rowId} = submitController.payload;

        await stationModel.Update(rowId, stationData);

        stationTable.row(rowIndex).data({_id: rowId, ...stationData}).draw();
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
  const tableData = await stationModel.Select();

  stationTable = window.jQuery('#station-list').DataTable({
    data: tableData,
    columns: [
      { title: 'ID', data: '_id' },
      { title: 'Number', data: 'number' },
      { title: 'Storage', data: 'storage' },
      { title: 'Need', data: 'need' },
      { title: 'Planet Location', data: 'planetLocation' },
      { title: 'Controls',
        render: () => `<button action="delete" class="btn btn-danger">Delete</button>
                       <button action="edit" class="btn btn-success">Edit</button>`
      },
    ]
  });

  $('.control-button').on('click', function () {
    submitController.submitReady = true;
  });

  $('#station-list').on('click', 'tbody tr button[action="delete"]', async function(event){
    const rowToDelete = $(event.target).closest('tr');
    const rowId = rowToDelete.children(":first").text();

    try {
      await stationModel.Delete(rowId);
      stationTable.row(rowToDelete).remove().draw();
    } catch (e) {
      console.log(e);
    }
  });

  $('#station-list').on('click', 'tbody tr button[action="edit"]', async function(event){
    const rowNode = $(event.target).closest('tr');
    const rowId = rowNode.children(":first").text();

    const rowToEdit = stationTable.row(rowNode);

    const elementToEdit = await stationModel.FindById(rowId);
    document.getElementById("number").value = elementToEdit.number;
    document.getElementById("storage").value = elementToEdit.storage;
    document.getElementById("need").value = elementToEdit.need;
    document.getElementById("planetLocation").value = elementToEdit.planetLocation;

    submitController.SetEditState({
      rowIndex: rowToEdit.index(),
      rowId,
    });
  });
}

function initListEvents () {
  document.addEventListener('stationsListDataChanged', function (e) {
    const dataTable = window.jQuery('#station-list').DataTable();

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
