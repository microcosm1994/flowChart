import fta from '@/components/_/fta'
import fta_report_get from '@/components/fta/report/get'
import fta_ref_get from '@/components/fta/ref/get'
import fta_end_get from '@/components/fta/end/get'
import fta_obj_get from '@/components/fta/obj/get'

export default {
	path: '/fta',
    name: 'fta',
    component: fta,
    redirect: { name: 'fta_report_get' },
    children:[
		{
		    path: '/fta/report/get',
		    name: 'fta_report_get',
		    component: fta_report_get
		},
		{
		    path: '/fta/ref/get',
		    name: 'fta_ref_get',
		    component: fta_ref_get
		},
		{
		    path: '/fta/end/get',
		    name: 'fta_end_get',
		    component: fta_end_get
		},
		{
		    path: '/fta/obj/get',
		    name: 'fta_obj_get',
		    component: fta_obj_get
		}
	]
}