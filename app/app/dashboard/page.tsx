
export default function Dashboard({ collapsed }: { collapsed: boolean }) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                <div className="rounded-r-xl bg-slate-900 p-6 border-l-6 border-yellow-500">
                    <p className="text-center">Total Sales</p>
                    <p className="text-2xl font-bold text-center">150</p>
                </div>
                <div className="rounded-r-xl bg-slate-900 p-6 border-l-6 border-purple-500">
                    <p className="text-center">Total Purchase</p>
                    <p className="text-2xl font-bold text-center">50</p>
                </div>
                <div className="rounded-r-xl bg-slate-900 p-6 border-l-6 border-green-500">
                    <p className="text-center">Total Products</p>
                    <p className="text-2xl font-bold text-center">1250</p>
                </div>
                <div className="rounded-r-xl bg-slate-900 p-6 border-l-6 border-green-500">
                    <p className="text-center">Total Suppliers</p>
                    <p className="text-2xl font-bold text-center">150</p>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="rounded-r-xl bg-slate-900 p-6 border-l-6 border-yellow-500">
                    <div className="text-lg font-semibold mb-6">Recent Sales</div>
                    <div className="text-gray-400">!No sales included yet</div>
                </div>
                <div className="rounded-r-xl bg-slate-900 p-6 border-l-6 border-purple-500">Employees</div>
            </div>

        </div>
    );
}
