@extends('backend.app')

@section('content')
<!--app-content open-->
<div class="app-content main-content mt-0">
    <div class="side-app">

        <!-- CONTAINER -->
        <div class="main-container container-fluid">

            <!-- PAGE-HEADER -->
            <div class="page-header mb-4">
                <div class="d-flex justify-content-between align-items-center w-100">
                    <div>
                        <h1 class="page-title fw-bold mb-1">{{ $crud ? ucwords(str_replace('_', ' ', $crud)) : 'Dashboard Analytics' }}</h1>
                        <p class="text-muted mb-0">Welcome back, {{ auth()->user()->name }}! Here's what's happening today.</p>
                    </div>
                    <div class="d-flex gap-2">
                     
                        <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" id="refreshDashboard">
                            <i class="fe fe-refresh-cw"></i>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
            <!-- PAGE-HEADER END -->

            <!-- ROW: SUMMARY CARDS -->
            <div class="row row-deck">
                <div class="col-xl-3 col-lg-6 col-md-6">
                    <div class="card overflow-hidden border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <span class="text-muted fs-12 d-block mb-1">Total Users</span>
                                    <h2 class="mb-0 fw-bold">{{ $totalUsers ?? 0 }}</h2>
                                </div>
                                <div class="avatar avatar-lg bg-primary bg-gradient rounded-circle">
                                    <i class="fe fe-users fs-20 text-white"></i>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xl-12 col-lg-12">
                    <div class="card shadow-sm border-0">
                        <div class="card-header border-bottom d-flex justify-content-between align-items-center">
                            <div>
                                <h3 class="card-title mb-1">Recent Users</h3>
                                <p class="text-muted mb-0 fs-12">Latest registered users</p>
                            </div>
                            <a href="{{ route('admin.users.index') }}" class="btn btn-outline-primary btn-sm">
                                View All <i class="fe fe-arrow-right ms-1"></i>
                            </a>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover table-vcenter text-nowrap mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="border-top-0">User</th>
                                            <th class="border-top-0">Email</th>
                                            <th class="border-top-0">Status</th>
                                            <th class="border-top-0">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($recentUsers as $user)
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar avatar-sm me-3 bg-primary bg-gradient rounded-circle">
                                                        <span class="avatar-text text-white">{{ strtoupper(substr($user->name, 0, 2)) }}</span>
                                                    </div>
                                                    <div>
                                                        <div class="fw-semibold">{{ $user->name }}</div>
                                                        <div class="text-muted fs-11">ID: {{ $user->id }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="text-muted">{{ $user->email }}</div>
                                            </td>
                                            <td>
                                                <span class="badge bg-success-transparent text-success">
                                                    <i class="fe fe-check-circle me-1"></i> Active
                                                </span>
                                            </td>
                                            <td>
                                                <div class="text-muted">{{ \Carbon\Carbon::parse($user->created_at)->format('M d, Y') }}</div>
                                                <div class="fs-11 text-muted">{{ \Carbon\Carbon::parse($user->created_at)->format('h:i A') }}</div>
                                            </td>

                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="text-muted fs-12">Showing {{ count($recentUsers) }} of {{ $totalUsers }} users</div>
                                <div class="btn-group">
                                    <button class="btn btn-outline-light btn-sm">
                                        <i class="fe fe-chevron-left"></i>
                                    </button>
                                    <button class="btn btn-outline-light btn-sm">
                                        <i class="fe fe-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <!-- ROW END -->

        </div>
    </div>
</div>
<!-- CONTAINER CLOSED -->
@endsection

@push('styles')
<style>
    /* Custom Dashboard Styles */
    .avatar { display: inline-flex; align-items: center; justify-content: center; }
    .avatar-text { font-weight: 600; font-size: 14px; }
    .legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #3B82F6; }
    .bg-gradient { background: linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-primary-dark) 100%); }
    .shadow-sm { box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06) !important; }
    .card { border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,0,0,0.04); }
    .btn-list { display: flex; gap: 4px; }
    .btn-icon { width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; }
</style>
@endpush

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/apexcharts@3.36.3/dist/apexcharts.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Refresh button
    document.getElementById('refreshDashboard').addEventListener('click', function() {
        const btn = this;
        btn.innerHTML = '<i class="fe fe-refresh-cw spin"></i> Refreshing...';
        btn.disabled = true;
        setTimeout(() => { window.location.reload(); }, 1500);
    });

    // Spin animation
    const style = document.createElement('style');
    style.textContent = `.spin { animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(style);

    // Period buttons
    document.querySelectorAll('[data-period]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });



    const userChart = new ApexCharts(document.querySelector("#user-analytics-chart"), {
        series: [
            { name: 'Registrations', type: 'column', data: registrations },
            { name: 'Active Users', type: 'line', data: activeUsers }
        ],
        chart: { height: 320, type: 'line', toolbar: { show: true } },
        stroke: { width: [0,3], curve: 'smooth' },
        plotOptions: { bar: { columnWidth: '55%', borderRadius: 4 } },
        colors: ['#3B82F6','#10B981'],
        xaxis: { categories: dates },
        yaxis: [
            { title: { text: 'Registrations', style: { color:'#3B82F6' } }, labels: { style:{ colors:'#3B82F6' } } },
            { opposite: true, title:{ text:'Active Users', style:{ color:'#10B981' } }, labels:{ style:{ colors:'#10B981' } } }
        ],
        tooltip: { shared:true, intersect:false, y:{ formatter: y => y ? y.toFixed(0)+' users':'' } },
        grid: { borderColor:'#f1f1f1' }
    });
    userChart.render();

    // Traffic Chart

    const trafficChart = new ApexCharts(document.querySelector("#traffic-chart"), {
        series: trafficSeries,
        chart: { type:'donut', height:320 },
        labels: trafficLabels,
        colors: trafficColors,
        plotOptions: { pie: { donut:{ size:'65%' } } },
        dataLabels: { enabled:false }
    });
    trafficChart.render();
});
</script>
@endpush
