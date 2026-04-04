import { getZukanItems } from "@/lib/zukan";

export default async function ZukanPage() {
  const items = await getZukanItems();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3">
          <span className="w-fit rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
            Winttle Assistant
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            アシスタント紹介一覧
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Googleスプレッドシートのデータをもとに、アシスタント情報をカード形式で一覧表示しています。
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-900">データがありません</p>
            <p className="mt-2 text-sm text-gray-600">
              スプレッドシートの中身やAPI設定を確認してください。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-xl font-bold text-white">
                    {item.name.slice(0, 1)}
                  </div>
                  <span className="ml-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                    {item.category || "カテゴリ未設定"}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {item.name}
                  </h2>

                  <p className="mt-2 text-sm font-medium text-gray-700">
                    {item.shortIntro}
                  </p>

                  <p className="mt-4 line-clamp-5 text-sm leading-6 text-gray-600">
                    {item.fullIntro}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}