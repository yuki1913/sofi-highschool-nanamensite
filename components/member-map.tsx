"use client"

import { useEffect, useRef, useState } from "react"
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

export function MemberMap({ members, onOpenDetail }: { members: Member[]; onOpenDetail: (member: Member) => void }) {
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([])
  const [geocoding, setGeocoding] = useState(false)
  const cancelRef = useRef(false)

  useEffect(() => {
    if (members.length === 0) return

    cancelRef.current = false

    // 場所ごとにメンバーをグループ化
    const locationMap = new Map<string, Member[]>()
    for (const m of members) {
      if (!m.location) continue
      locationMap.set(m.location, [...(locationMap.get(m.location) ?? []), m])
    }

    const uniqueLocations = [...locationMap.keys()]
    if (uniqueLocations.length === 0) return

    setGeoPoints([])
    setGeocoding(true)

    // サーバー側 API で一括ジオコーディング
    fetch("/api/geocode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locations: uniqueLocations }),
    })
      .then((res) => res.json())
      .then((coords: Record<string, [number, number]>) => {
        if (cancelRef.current) return
        const points: GeoPoint[] = []
        for (const [location, mems] of locationMap.entries()) {
          if (coords[location]) {
            points.push({
              location,
              lat: coords[location][0],
              lng: coords[location][1],
              members: mems,
            })
          }
        }
        setGeoPoints(points)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelRef.current) setGeocoding(false)
      })

    return () => {
      cancelRef.current = true
    }
  }, [members])

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-[#ddd5c4]"
      style={{ height: "65vh", minHeight: 400, boxShadow: "0 4px 24px rgba(30,58,95,0.08)" }}
    >
      {/* ジオコーディング中のオーバーレイ */}
      {geocoding && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-[#ddd5c4] shadow-sm">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#1e3a5f]/20 border-t-[#1e3a5f] animate-spin" />
          <span className="text-[11px] text-[#1e3a5f] font-medium" style={{ fontFamily: "var(--font-zen-maru-gothic)" }}>
            地点を読み込み中…
          </span>
        </div>
      )}

      <MapContainer
        center={[36.5, 137.5]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
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
            <Popup maxWidth={400} autoPan>
              <div style={{ padding: "10px 20px 8px", background: "#f5f0e6", borderBottom: "1px solid #ebe4d6", width: "100%" }}>
                <p style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 13, margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ color: "#c5a84a" }}>●</span>
                  {point.location}
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 500, color: "#264a75" }}>
                    {point.members.length}名
                  </span>
                </p>
              </div>

              <div style={{ maxHeight: 300, overflowY: "auto", background: "#fff", width: "100%" }}>
                {point.members.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onOpenDetail(m)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid #f5f0e6", cursor: "pointer" }}
                  >
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
