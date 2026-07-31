import Swal from "sweetalert2";

export function toastSuccess(msg: string) {
  Swal.fire({ icon: "success", title: msg, toast: true, position: "top-end", showConfirmButton: false, timer: 2000, background: "#000", color: "#fff" });
}

export function toastError(msg: string) {
  Swal.fire({ icon: "error", title: msg, toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#000", color: "#fff" });
}

export function confirmDelete(name: string): Promise<boolean> {
  return Swal.fire({
    title: "Delete?",
    text: `Permanently delete ${name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
    background: "#000",
    color: "#fff",
  }).then((r) => r.isConfirmed);
}
