import React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const GridTable = ({
  title,
  handleBulkDelete,
  selectedRows,
  rows,
  columns,
  setSelectedRows,
}) => {
  return (
    <>
      <section id="table" className="h-full min-h-[90vh]">
        <Box className="">
          {/* Bulk Delete Button */}
          {/* {selectedRows.length > 0 && (
            <div className="flex justify-end mb-2">
              <button
                className="bg-primary hover:bg-hover_color text-white p-3 text-sm hover:bg-primary_hover"
                onClick={handleBulkDelete}
              >
                Delete Selected Rows ({selectedRows.length})
              </button>
            </div>
          )} */}

          <h1 className="text-white mb-5 text-4xl font-bold">{title}</h1>

          <DataGrid
            rows={rows}
            className="text-white bg-primary shadow-lg rounded-lg"
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) =>
              setSelectedRows(newSelection)
            }
            disableRowSelectionOnClick
          />
        </Box>
      </section>
    </>
  );
};

export default GridTable;
