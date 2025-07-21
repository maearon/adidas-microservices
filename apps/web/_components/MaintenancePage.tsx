"use client"

export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-1000 w-screen h-screen bg-white text-black overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col items-center text-center space-y-6">
        {/* Logo (chữ thay cho ảnh) */}
        <div className="text-3xl font-bold tracking-wide">adidas</div>

        {/* Reference Error */}
        <p className="text-sm text-gray-600">Reference Error: 18.83e6ab71.1752472560.8c21dccb</p>

        {/* Main message */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase">
          Unfortunately we are unable to give you access to our site at this time.
        </h1>
        <p className="text-base sm:text-lg text-gray-700 max-w-xl">
          A security issue was automatically identified, when you tried to access the website.
        </p>

        {/* 2 columns: cause & resolve */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left w-full max-w-4xl mt-8">
          {/* Column 1: What caused this */}
          <div>
            <h2 className="text-lg font-semibold mb-2">What could have caused this?</h2>
            <p className="text-sm sm:text-base text-gray-700">
              During high-traffic product releases we have extra security in place to prevent bots
              entering our site. We do this to protect customers and to give everyone a fair chance
              of getting the sneakers. Something in your setup must have triggered our security
              system, so we cannot allow you onto the site.
            </p>
          </div>

          {/* Column 2: How can I resolve */}
          <div>
            <h2 className="text-lg font-semibold mb-2">How can I resolve this?</h2>
            <p className="text-sm sm:text-base text-gray-700">
              Please try refreshing or accessing our website from a different browser or another
              device. You could also check if there are any scripts, like ad blockers, running in
              your browser and disable them.
              <br />
              <br />
              If this does not help, the issue might be caused by malware. If you're on a personal
              connection you can run an anti-virus scan on your device to make sure it's not
              affected by malware. If you're on a shared network, you could ask the system
              administrator to run a scan looking for misconfigured or infected devices across the
              network.
            </p>
          </div>
        </div>

        {/* Footer message */}
        <p className="text-sm text-gray-500 mt-10">HTTP 403 - Forbidden</p>
      </div>
    </div>
  )
}
