import {  useHostels } from "../../hooks/useHostel";
import { Modal, Toast } from "../../ui/hostelUi";
import { DeleteModal } from "./HostelDelete";
import { HostelForm } from "./HostelForm";
import { HostelTable } from "./HostelTable";

export default function App() {
    const {
      rows,
      filtered,
      apiState,
      apiError,
      refetch,
      modal,
      setModal,
      search,
      setSearch,
      toast,
      handleAdd,
      handleEdit,
      handleDelete,
    } = useHostels();
    // console.log(filtered);
  
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center pt-36 px-4">
        <div className="w-full max-w-7xl">
          {/* Toast */}
          {toast && <Toast toast={toast} />}
    
          {/* Table */}
          <HostelTable
            rows={filtered}
            totalCount={rows.length}
            search={search}
            apiState={apiState}
            apiError={apiError}
            onSearchChange={setSearch}
            onOpenModal={setModal}
            onRefetch={refetch}
          />
    
          {/* Modal Overlay */}
          {modal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              {modal.type === "add" && (
                <Modal title="Add New Hostel" onClose={() => setModal(null)}>
                  <HostelForm
                    onSubmit={handleAdd}
                    onCancel={() => setModal(null)}
                    isEdit={false}
                  />
                </Modal>
              )}
    
              {modal.type === "edit" && (
                <Modal title="Edit Hostel" onClose={() => setModal(null)}>
                  <HostelForm
                    defaultValues={{
                      hostelId: modal.row.hostelId,
                      name: modal.row.name,
                      address: modal.row.address,
                      phoneNumber: modal.row.phoneNumber,
                    }}
                    onSubmit={handleEdit}
                    onCancel={() => setModal(null)}
                    isEdit={true}
                  />
                </Modal>
              )}
    
              {modal.type === "delete" && (
                <DeleteModal
                  hostel={modal.row}
                  onConfirm={handleDelete}
                  onCancel={() => setModal(null)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }