export async function POST(request: Request) {
    const { destinationType, destinationId, amount, note } = await request.json();
}