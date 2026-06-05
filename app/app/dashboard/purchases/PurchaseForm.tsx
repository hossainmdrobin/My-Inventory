import React from 'react'

export default function PurchaseForm({ form, setForm, handleSubmit, setOpen }: {
    form: {
        name: string;
        supplier: string;
        items: number;
        totalPrice: number;
        createdBy: string;
    };
    setForm: (form: any) => void;
    handleSubmit: () => void;
    setOpen: (open: boolean) => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div>
            
            </div>
            <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">Add Purchase</h2>
                <input
                    type="text"
                    placeholder="Purchase Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                />
                <textarea placeholder='Description' className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2" />
                <select >

                </select>


                {/* {[
                    ["name", "Purchase Name"],
                    ["supplier", "Supplier"],
                    ["items", "Items"],
                    ["totalPrice", "Total Price"],
                    ["createdBy", "Created By"],
                ].map(([key, label]) => (
                    <input
                        key={key}
                        type={
                            key === "items" || key === "totalPrice"
                                ? "number"
                                : "text"
                        }
                        placeholder={label}
                        value={(form as any)[key]}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                [key]:
                                    key === "items" || key === "totalPrice"
                                        ? Number(e.target.value)
                                        : e.target.value,
                            })
                        }
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2"
                    />
                ))} */}

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
            <div>
                Products
            </div>
        </div>
    )
}
