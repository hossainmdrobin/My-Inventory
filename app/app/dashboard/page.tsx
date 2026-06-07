import OverviewCard from "./cards/OverviewCard";


export default function Dashboard({ collapsed }: { collapsed: boolean }) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <h2 className="text-xl font-semibold">Financial Overview</h2>            
            <hr />
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-4 mb-4">
                <OverviewCard text="Total Cash Balance" value="$25,000" />
                <OverviewCard text="Total Stock Value" value="50" />
                <OverviewCard text="Total Customer Due" value="1250" />
                <OverviewCard text="Total Company Payable" value="$15,000" />
                <OverviewCard text="Net Business worth" value="$50,000" />
                <OverviewCard text="Total Suppliers" value="150" />
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
