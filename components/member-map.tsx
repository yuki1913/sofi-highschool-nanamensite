"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Member } from "@/lib/zukan"

type GeoPoint = {
  location: string
  lat: number
  lng: number
  members: Member[]
}

async function geocodeLocation(location: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      { headers: { "User-Agent": "SOFI-Nanamen-Site/1.0" } }
    )
    const data = await res.json()
    if (data[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
  } catch {}
  return null
}

function createMarkerIcon(count: number) {
  return L.divIcon({
    html: `<div style="
      background:#1e3a5f;
      color:#f5f0e6;
      border:2.5px solid #c5a84a;
      border-radius:50%;
      width:40px;
      height:40px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:14px;
      font-weight:700;
      box-shadow:0 3px 14px rgba(30,58,95,0.45),0 0 0 5px rgba(197,168,74,0.18);
      font-family:sans-serif;
      cursor:pointer;
    ">${count}</div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -26],
  })
}

export function MemberMap({ members }: { members: Member[] }) {
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const locationMap = new Map<string, Member[]>()
    for (const m of members) {
      if (!m.location) continue
      locationMap.set(m.location, [...(locationMap.get(m.location) ?? []), m])
    }

    Promise.all(
      [...locationMap.entries()].map(async ([location, mems]) => {
        const coords = await geocodeLocation(location)
        if (!coords) return null
        return { location, lat: coords[0], lng: coords[1], members: mems }
      })
    ).then((results) => {
      setGeoPoints(results.filter((r): r is GeoPoint => r !== null))
      setLoading(false)
    })
  }, [members])

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-[#ddd5c4]"
        style={{ height: "65vh", minHeight: 400 }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-[#1e3a5f]/20 border-t-[#1e3a5f] animate-spin" />
        <p
          className="text-[10px] tracking-[0.4em] text-[#c5a84a] uppercase font-semibold"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          地図を読み込み中
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden border border-[#ddd5c4]"
      style={{ height: "65vh", minHeight: 400, boxShadow: "0 4px 24px rgba(30,58,95,0.08)" }}
    >
      <MapContainer
        center={[36.5, 137.5]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        {/* CartoDB Positron — クリーンなライトグレーの地図 */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {geoPoints.map((point) => (
          <Marker
            key={point.location}
            position={[point.lat, point.lng]}
            icon={createMarkerIcon(point.members.length)}
          >
            <Popup maxWidth={280} autoPan>
              {/* ヘッダー */}
              <div style={{ padding: "10px 20px 8px", background: "#f5f0e6", borderBottom: "1px solid #ebe4d6", width: "100%" }}>
                <p style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13, margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ color: "#c5a84a" }}>●</span>
                  {point.location}
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 500, color: "#264a75" }}>
                    {point.members.length}名
                  </span>
                </p>
              </div>

              {/* メンバー一覧 */}
              <div style={{ maxHeight: 300, overflowY: "auto", background: "#fff", width: "100%" }}>
                {point.members.map((m) => (
                  <div
                    key={m.id}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid #f5f0e6" }}
                  >
                    {/* 顔写真 or イニシャル */}
                    <div style={{
                      width: 52, height: 52, borderRadius: "50%", overflow: "hidden",
                      flexShrink: 0, background: "#eee8dc", border: "2px solid #c5a84a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {m.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.imageUrl}
                          alt={m.name}
                          referrerPolicy="no-referrer"
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                        />
                      ) : (
                        <span style={{ color: "#1e3a5f", fontWeight: 700, fontSize: 20 }}>
                          {m.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* テキスト情報 */}
                    <div>
                      <p style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13, margin: "0 0 4px" }}>
                        {m.name}
                      </p>
                      {m.ageGroup && (
                        <span style={{
                          display: "inline-block", fontSize: 10, padding: "1px 8px",
                          borderRadius: 9999, fontWeight: 600, marginBottom: 3,
                          background: m.ageGroup.includes("25") ? "rgba(197,168,74,0.9)"
                            : m.ageGroup.includes("20") ? "rgba(30,58,95,0.85)"
                            : "rgba(100,100,100,0.7)",
                          color: "#f5f0e6",
                        }}>
                          {m.ageGroup}
                        </span>
                      )}
                      {m.university && (
                        <p style={{ fontSize: 11, color: "#264a75", margin: "2px 0 0" }}>
                          {m.university}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
