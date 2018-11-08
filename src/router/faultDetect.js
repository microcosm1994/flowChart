import faultDetect from '@/components/_/faultDetect'
import faultDetect_projectParameter_get from '@/components/faultDetect/projectParameter/get'
import faultDetect_alarmLog_get from '@/components/faultDetect/alarmLog/get'
import faultDetect_faultTree_get from '@/components/faultDetect/faultTree/get'
import faultDetect_log_get from '@/components/faultDetect/log/get'
import faultDetect_project_get from '@/components/faultDetect/project/get'
import faultDetect_faultTreeIndex_get from '@/components/faultDetect/faultTreeIndex/get'
import faultDetect_forecast_get from '@/components/faultDetect/forecast/get'
import faultDetect_eventMiddle_get from '@/components/faultDetect/eventMiddle/get'
import faultDetect_parameterFaultMsg_get from '@/components/faultDetect/parameterFaultMsg/get'
import faultDetect_eventEnd_get from '@/components/faultDetect/eventEnd/get'
import faultDetect_projectSub_get from '@/components/faultDetect/projectSub/get'
import faultDetect_parameter_get from '@/components/faultDetect/parameter/get'
import faultDetect_ruleName_get from '@/components/faultDetect/ruleName/get'
import faultDetect_device_get from '@/components/faultDetect/device/get'
import faultDetect_ruleScript_get from '@/components/faultDetect/ruleScript/get'

export default {
	path: '/faultDetect',
    name: 'faultDetect',
    component: faultDetect,
    redirect: { name: 'faultDetect_projectParameter_get' },
    children:[
		{
		    path: '/faultDetect/projectParameter/get',
		    name: 'faultDetect_projectParameter_get',
		    component: faultDetect_projectParameter_get
		},
		{
		    path: '/faultDetect/alarmLog/get',
		    name: 'faultDetect_alarmLog_get',
		    component: faultDetect_alarmLog_get
		},
		{
		    path: '/faultDetect/faultTree/get',
		    name: 'faultDetect_faultTree_get',
		    component: faultDetect_faultTree_get
		},
		{
		    path: '/faultDetect/log/get',
		    name: 'faultDetect_log_get',
		    component: faultDetect_log_get
		},
		{
		    path: '/faultDetect/project/get',
		    name: 'faultDetect_project_get',
		    component: faultDetect_project_get
		},
		{
		    path: '/faultDetect/faultTreeIndex/get',
		    name: 'faultDetect_faultTreeIndex_get',
		    component: faultDetect_faultTreeIndex_get
		},
		{
		    path: '/faultDetect/forecast/get',
		    name: 'faultDetect_forecast_get',
		    component: faultDetect_forecast_get
		},
		{
		    path: '/faultDetect/eventMiddle/get',
		    name: 'faultDetect_eventMiddle_get',
		    component: faultDetect_eventMiddle_get
		},
		{
		    path: '/faultDetect/parameterFaultMsg/get',
		    name: 'faultDetect_parameterFaultMsg_get',
		    component: faultDetect_parameterFaultMsg_get
		},
		{
		    path: '/faultDetect/eventEnd/get',
		    name: 'faultDetect_eventEnd_get',
		    component: faultDetect_eventEnd_get
		},
		{
		    path: '/faultDetect/projectSub/get',
		    name: 'faultDetect_projectSub_get',
		    component: faultDetect_projectSub_get
		},
		{
		    path: '/faultDetect/parameter/get',
		    name: 'faultDetect_parameter_get',
		    component: faultDetect_parameter_get
		},
		{
		    path: '/faultDetect/ruleName/get',
		    name: 'faultDetect_ruleName_get',
		    component: faultDetect_ruleName_get
		},
		{
		    path: '/faultDetect/device/get',
		    name: 'faultDetect_device_get',
		    component: faultDetect_device_get
		},
		{
		    path: '/faultDetect/ruleScript/get',
		    name: 'faultDetect_ruleScript_get',
		    component: faultDetect_ruleScript_get
		}
	]
}