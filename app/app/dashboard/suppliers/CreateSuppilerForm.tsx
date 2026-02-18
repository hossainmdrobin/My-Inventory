import { useCreateSupplierMutation } from '@/redux/slices/api.slices'
import React from 'react'

export default function CreateSuppilerForm({ editing, form, setForm, setOpen, handleSubmit }: { editing: any, form: any, setForm: any, setOpen: any, handleSubmit: any }) {
console.log(form, "Form data in create supplier form")
    const [] = useCreateSupplierMutation()
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">
                    {editing ? "Edit Supplier" : "Add Supplier"}
                </h2>

                <input
                    placeholder="Supplier Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                />

                <input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                />

                <textarea
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                />

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 rounded-lg border border-slate-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg bg-blue-600 font-semibold"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
