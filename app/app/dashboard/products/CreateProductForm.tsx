import { useGetSuppliersQuery } from "@/redux/slices/api.slices";

export default function CreateProductForm({ editing, form, setForm, handleSubmit, setOpen }: { editing: any, form: any, setForm: any, handleSubmit: () => void, setOpen: (open: boolean) => void }) {
const { data: suppliers } = useGetSuppliersQuery({key: ""});
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-xl bg-slate-900 p-6 space-y-4">
                <h2 className="text-xl font-semibold">
                    {editing ? "Edit Product" : "Add Product"}
                </h2>

                <input type="text" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none" />
                <label htmlFor="costPrice">Cost Price(BDT)</label>
                <input type="number" placeholder="Cost Price" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none" />
                <label htmlFor="sellingPrice">Selling Price(BDT)</label>
                <input type="number" placeholder="Selling Price" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none" />
                <label htmlFor="stock">Stock</label>
                <div className="flex items-center gap-2">
                    <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none w-3/4" />
                    <input type="text" value={form.unit} onChange={(e)=>setForm({...form, unit: e.target.value})} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none w-1/4"  />
                </div>
                {suppliers && <select value={form.supplier} onChange={(e) => setForm({...form, supplier: e.target.value})} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none">
                    {
                        suppliers?.map((supplier: any) => (
                            <option key={supplier._id} value={supplier?._id}>{supplier.name}</option>
                        ))
                    }
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                </select>}
                {/* {[
                    ["name", "Product Name"],
                    ["supplier", "Supplier"],
                    ["costPrice", "Cost Price"],
                    ["sellingPrice", "Selling Price"],
                    ["stock", "Stock"],
                ].map(([key, label]) => (
                    <input
                        key={key}
                        type={key.includes("Price") || key === "stock" ? "number" : "text"}
                        placeholder={label}
                        value={(form as any)[key]}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                [key]:
                                    key.includes("Price") || key === "stock"
                                        ? Number(e.target.value)
                                        : e.target.value,
                            })
                        }
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none"
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
        </div>
    )
}
