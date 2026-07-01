import { Route, Routes } from 'react-router-dom'
import { RouteTransition } from '@/mobile/navigation/route-transition'
import { routeMetaList } from '@/mobile/navigation/route-config'

export function MobileRoutes() {
  return (
    <Routes>
      <Route element={<RouteTransition />}>
        {routeMetaList.map((meta) => (
          <Route key={meta.path} path={meta.path} element={meta.element} />
        ))}
        <Route path="*" element={routeMetaList[0].element} />
      </Route>
    </Routes>
  )
}
