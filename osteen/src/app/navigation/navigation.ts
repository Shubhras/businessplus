
import { FuseNavigation } from '@fuse/types';
import * as _ from 'lodash';
const userModulePermission: Array<any> = JSON.parse(localStorage.getItem('userModulePermission'));
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
console.log('jjj', currentUser);

let parentModules = [];
const childrensModules = [];
const children = [];
const parentModulesStore = [];
const childrens: FuseNavigation[] = parentModulesStore;
const modulePermissions = {};
// const role_id = currentUser.role_id;
if (userModulePermission) {
    for (let i = 0; i < userModulePermission.length; i++) {
        // if(userModulePermission[i] == 'Administration'){
        //     console.log('kkk');
        //     // userModulePermission[i].icon_class = 'settings';
        // }
        // store parentmodules array
        let parentId = userModulePermission[i].parent;
        if (parentId == 0 && userModulePermission[i].sidebar_status == 1) {
            parentModules.push(userModulePermission[i]);
        }
        // store childrensmodules array
        if (parentId != 0 && userModulePermission[i].acc_view == 1) {
            children.push(userModulePermission[i].id);
            childrensModules.push(userModulePermission[i]);
            if (modulePermissions.hasOwnProperty(parentId)) {
                modulePermissions[parentId].push(userModulePermission[i]);
            } else {
                modulePermissions[parentId] = [userModulePermission[i]];
            }
        }
    }
    parentModules = _.orderBy(parentModules, ['hierarchy'], ['asc']);
    localStorage.setItem('modulePermissions', JSON.stringify(modulePermissions));
    // filter child of childrensModules array
    const grandChildren = [];
    const grandChildrenModules = childrensModules.filter((child) => {
        if (children.indexOf(child.parent) !== -1) {
            grandChildren.push(child.id);
            return children.indexOf(child.parent) !== -1;
        }
    });
    const greatGrandChildren = childrensModules.filter((child) => {
        return grandChildren.indexOf(child.parent) !== -1;
    });
    const greatGrandChildrenTest = greatGrandChildren.filter((child) => {
        return grandChildren.indexOf(child.parent) !== -1;
    });
    // map parentmodules array
    parentModules.map((parentData: any) => {
        const parentModule = {};
        parentModule['id'] = parentData.id;
        parentModule['title'] = parentData.display_name;
        parentModule['translate'] = 'NAV.SCRUMBOARD';
        parentModule['type'] = 'item';
        parentModule['icon'] = parentData.icon_class;
        parentModule['url'] = '/apps/' + parentData.display_url;
        parentModule['children'] = [];
        // map childrenmodules array
        for (let i = 0; i < childrensModules.length; i++) {
            if (childrensModules[i].parent === parentData.id) {
                parentModule['type'] = 'collapsable';
                delete parentModule['url'];
                let child = childrensModules[i];
                const childrensModule = {};
                childrensModule['id'] = child.hierarchy;
                childrensModule['title'] = child.display_name;
                childrensModule['type'] = 'item';
                childrensModule['url'] = '/apps/' + child.display_url;
                childrensModule['children'] = [];
                for (var j = 0; j < grandChildrenModules.length; ++j) {
                    if (grandChildrenModules[j].parent === childrensModules[i].id) {
                        childrensModule['type'] = 'collapsable';
                        delete childrensModule['url'];
                        const grandChild = grandChildrenModules[j];
                        const grandChildrensModule = {};
                        grandChildrensModule['id'] = grandChild.hierarchy;
                        grandChildrensModule['title'] = grandChild.display_name;
                        grandChildrensModule['type'] = 'item';
                        grandChildrensModule['url'] = '/apps/' + grandChild.display_url;
                        grandChildrensModule['children'] = [];
                        for (var k = 0; k < greatGrandChildren.length; ++k) {
                            if (grandChildrenModules[j].id === greatGrandChildren[k].parent) {
                                grandChildrensModule['type'] = 'collapsable';
                                delete grandChildrensModule['url'];
                                const greatGrandChild = greatGrandChildren[k];
                                const greatGrandChildrensModule = {};
                                greatGrandChildrensModule['id'] = greatGrandChild.hierarchy;
                                greatGrandChildrensModule['title'] = greatGrandChild.display_name;
                                greatGrandChildrensModule['type'] = 'item';
                                greatGrandChildrensModule['url'] = '/apps/' + greatGrandChild.display_url;
                                greatGrandChildrensModule['children'] = [];
                                for (var l = 0; l < greatGrandChildrenTest.length; ++l) {
                                    if (greatGrandChildren[k].id === greatGrandChildrenTest[l].parent) {
                                        greatGrandChildrensModule['type'] = 'collapsable';
                                        delete greatGrandChildrensModule['url'];
                                        const greatGrandChildTest = greatGrandChildrenTest[l];
                                        const greatGrandChildrensModuleTest = {};
                                        greatGrandChildrensModuleTest['id'] = greatGrandChildTest.hierarchy;
                                        greatGrandChildrensModuleTest['title'] = greatGrandChildTest.display_name;
                                        greatGrandChildrensModuleTest['type'] = 'item';
                                        greatGrandChildrensModuleTest['url'] = '/apps/' + greatGrandChildTest.display_url;
                                        greatGrandChildrensModule['children'].push(greatGrandChildrensModuleTest);
                                        greatGrandChildrensModule['children'] = _.orderBy(greatGrandChildrensModule['children'], ['id'], ['asc']);
                                    }
                                }
                                grandChildrensModule['children'].push(greatGrandChildrensModule);
                                grandChildrensModule['children'] = _.orderBy(grandChildrensModule['children'], ['id'], ['asc']);
                            }
                        }
                        childrensModule['children'].push(grandChildrensModule);
                        childrensModule['children'] = _.orderBy(childrensModule['children'], ['id'], ['asc']);
                    }
                }
                parentModule['children'].push(childrensModule);
                // sort childrenmodules array
                parentModule['children'] = _.orderBy(parentModule['children'], ['id'], ['asc']);
            }
        }
        parentModulesStore.push(parentModule);
    });
    //  default pages navigation
    /* childrens.push(
       {
           id: 'defaultpages',
           title    : 'Prima Plus Navigation',
           translate: 'NAV.SCRUMBOARD',
           type     : 'collapsable',
           icon     : 'view_module',
           children : [
               {
                   id   : 'business-faq',
                   title: 'Faq',
                   type : 'item',
                   url  : '/apps/faq'
               },
               {
                   id   : 'knowledge-base',
                   title: 'Help',
                   type : 'item',
                   url  : '/apps/knowledge-base'
               },
               {
                   id   : 'prima-demo',
                   title: 'Demo',
                   type : 'item',
                   url  : '/apps/prima-demo'
               },
               {
                   id   : 'prima-process',
                   title: 'Prima Process',
                   type : 'item',
                   url  : '/apps/prima-process'
               },
           ]
        }
   ); */
    // L1 
    const role_id = currentUser.role_id;
    console.log('role_id', role_id);
   
    if (role_id == 1 || role_id == 2 || role_id == 3 || role_id == 4) {
        childrens.unshift(
            // {
            //     id: 'prima-welcomes',
            //     title: 'DashBoard',
            //     translate: 'NAV.SCRUMBOARD',
            //     type: 'item',
            //     icon: 'dashboard',
            //     url: '/apps/welcome-screen'
            // },
            {
                id: 'main-dashboard',
                title: 'Home',
                translate: 'NAV.SCRUMBOARD',
                type: 'item',
                icon: 'home',
                url: '/apps/main-dashboard'
            },
            {
                id: 'prima-welcomes',
                title: 'Dashboard',
                translate: 'NAV.SCRUMBOARD',
                type: 'collapsable',
                icon: 'dashboard',
                url: '/apps/welcome-screen',
                children: [
                    {
                        id: 'perf_rprt',
                        title: 'Management Dashboard',
                        type: 'item',
                        url: '/apps/company-performances'
                    },
                    {
                        id: 'func_rprt',
                        title: 'Function Report',
                        type: 'item',
                        url: '/apps/strategic-obj/qtly-summary'
                    }
                ]
            },
            {
                id: 'prima-welcomess',
                title: 'Strategy Map',
                translate: 'NAV.SCRUMBOARD',
                type: 'item',
                icon: 'timeline',
                url: '/apps/strategic-obj/graph'
            },

            {
                id: 'defaultpages',
                title: 'Current Business Plan',
                translate: 'NAV.SCRUMBOARD',
                type: 'collapsable',
                icon: 'view_module',
                children: [
                    {
                        id: 'func_rprt',
                        title: 'Master Plan',
                        type: 'item',
                        url: '/apps/business-plan-list-view'
                    },
                    {
                        id: 'perf_rprt',
                        title: 'Hoshin Kanri',
                        type: 'item',
                        url: '/apps/strategic-obj/hoshin'
                    },
                    // {
                    //     id: 'defaultpages2',
                    //     title: 'Management Report',
                    //     translate: 'NAV.SCRUMBOARD',
                    //     type: 'collapsable',
                    //     icon: 'assignment',
                    //     children: [
                    //         {
                    //             id: 'func_rprt2',
                    //             title: 'Functional Report',
                    //             type: 'item',
                    //             url: '/apps/strategic-obj/qtly-summary'
                    //         },
                    //         {
                    //             id: 'perf_rprt2',
                    //             title: 'Performance Report',
                    //             type: 'item',
                    //             url: '/apps/company-performances'
                    //         },
                    //     ]
                    // }
                ]
            },
            // {
            //     id: 'Get-Started',
            //     title: 'Get Started',
            //     translate: 'NAV.SCRUMBOARD',
            //     type: 'item',
            //     icon: 'timeline',
            //     url: '/apps/strategic-obj/started/1'
            // },
            // {
            //     id: 'prima-welcome',
            //     title: 'Master Plans',
            //     translate: 'NAV.SCRUMBOARD',
            //     type: 'item',
            //     icon: 'dashboard',
            //     url: '/apps/business-plan-list-view'
            // },

            //  {
            //     id: 'hoshin',
            //     title: 'Hoshin Kanri',
            //     translate: 'NAV.SCRUMBOARD',
            //     type: 'item',
            //     icon: 'dashboard',
            //     url: '/apps/strategic-obj/hoshin'
            // },
        );
    }
    else if(role_id == 5){
        childrens.unshift(
            {
                id: 'main-dashboard',
                title: 'Home',
                translate: 'NAV.SCRUMBOARD',
                type: 'item',
                icon: 'home',
                url: '/apps/main-dashboard'
            },
            {
                id: 'prima-welcomes',
                title: 'Dashboard',
                translate: 'NAV.SCRUMBOARD',
                type: 'collapsable',
                icon: 'dashboard',
                url: '/apps/welcome-screen',
                children: [
                    {
                        id: 'func_rprt',
                        title: 'Function Report',
                        type: 'item',
                        url: '/apps/strategic-obj/qtly-summary'
                    }
                ]
            },
            {
                id: 'prima-welcomess',
                title: 'Strategy Map',
                translate: 'NAV.SCRUMBOARD',
                type: 'item',
                icon: 'timeline',
                url: '/apps/strategic-obj/graph'
            },

            {
                id: 'defaultpages',
                title: 'Current Business Plan',
                translate: 'NAV.SCRUMBOARD',
                type: 'collapsable',
                icon: 'view_module',
                children: [
                    {
                        id: 'func_rprt',
                        title: 'Master Plan',
                        type: 'item',
                        url: '/apps/business-plan-list-view'
                    },
                    {
                        id: 'perf_rprt',
                        title: 'Hoshin Kanri',
                        type: 'item',
                        url: '/apps/strategic-obj/hoshin'
                    },
                ]
            },
        );
    }
    else if(role_id == 6 ){
        childrens.unshift(
            {
                id: 'main-dashboard',
                title: 'Home',
                translate: 'NAV.SCRUMBOARD',
                type: 'item',
                icon: 'home',
                url: '/apps/main-dashboard'
            },
            {
                id: 'prima-welcomes',
                title: 'Dashboard',
                translate: 'NAV.SCRUMBOARD',
                type: 'collapsable',
                icon: 'dashboard',
                url: '/apps/welcome-screen',
            },
            {
                id: 'defaultpages',
                title: 'Current Business Plan',
                translate: 'NAV.SCRUMBOARD',
                type: 'collapsable',
                icon: 'view_module',
                children: [
                    {
                        id: 'func_rprt',
                        title: 'Master Plan',
                        type: 'item',
                        url: '/apps/business-plan-list-view'
                    },
                ]
            },
            
        );
    }
    else {
        childrens.unshift(
            // {
            //     id: 'prima-welcomes',
            //     title: 'DashBoard',
            //     translate: 'NAV.SCRUMBOARD',
            //     type: 'item',
            //     icon: 'dashboard',
            //     url: '/apps/welcome-screen'
            // },
            {
                id: 'main-dashboard',
                title: 'Home',
                translate: 'NAV.SCRUMBOARD',
                type: 'item',
                icon: 'home',
                url: '/apps/main-dashboard'
            },
            {
                id: 'prima-welcomes',
                title: 'Dashboard',
                translate: 'NAV.SCRUMBOARD',
                type: 'collapsable',
                icon: 'dashboard',
                url: '/apps/welcome-screen',
                children: [
                    {
                        id: 'perf_rprt',
                        title: 'Management Dashboard',
                        type: 'item',
                        url: '/apps/company-performances'
                    },
                    {
                        id: 'func_rprt',
                        title: 'Function Report',
                        type: 'item',
                        url: '/apps/strategic-obj/qtly-summary'
                    }
                ]
            },
            {
                id: 'defaultpages',
                title: 'Current Business Plan',
                translate: 'NAV.SCRUMBOARD',
                type: 'collapsable',
                icon: 'view_module',
                children: [
                    {
                        id: 'func_rprt',
                        title: 'Master Plan',
                        type: 'item',
                        url: '/apps/business-plan-list-view'
                    },
                    {
                        id: 'perf_rprt',
                        title: 'Hoshin Kanri',
                        type: 'item',
                        url: '/apps/strategic-obj/hoshin'
                    },
                    // {
                    //     id: 'defaultpages2',
                    //     title: 'Management Report',
                    //     translate: 'NAV.SCRUMBOARD',
                    //     type: 'collapsable',
                    //     icon: 'assignment',
                    //     children: [
                    //         {
                    //             id: 'func_rprt2',
                    //             title: 'Functional Report',
                    //             type: 'item',
                    //             url: '/apps/strategic-obj/qtly-summary'
                    //         },
                    //         {
                    //             id: 'perf_rprt2',
                    //             title: 'Performance Report',
                    //             type: 'item',
                    //             url: '/apps/company-performances'
                    //         },
                    //     ]
                    // }
                ]
            },
            // {
            //     id: 'Get-Started',
            //     title: 'Get Started',
            //     translate: 'NAV.SCRUMBOARD',
            //     type: 'item',
            //     icon: 'timeline',
            //     url: '/apps/strategic-obj/started/1'
            // },
            // {
            //     id: 'prima-welcome',
            //     title: 'Master Plans',
            //     translate: 'NAV.SCRUMBOARD',
            //     type: 'item',
            //     icon: 'dashboard',
            //     url: '/apps/business-plan-list-view'
            // },

            //  {
            //     id: 'hoshin',
            //     title: 'Hoshin Kanri',
            //     translate: 'NAV.SCRUMBOARD',
            //     type: 'item',
            //     icon: 'dashboard',
            //     url: '/apps/strategic-obj/hoshin'
            // },
        );
    }
    //test navigation
    // childrens.unshift(

    // );
    childrens.push(
        // {
        //     id: 'defaultpages',
        //     title: 'Events',
        //     translate: 'NAV.SCRUMBOARD',
        //     type: 'collapsable',
        //     icon: 'view_module',
        //     children: [
        //         {
        //             id: 'task-events',
        //             title: 'Events',
        //             type: 'item',
        //             url: '/apps/task-events'
        //         },

        // {
        //     id: 'task-events',
        //     title: 'Events',
        //     type: 'item',
        //     url: '/apps/events'
        // },
        /* {
            id: 'performance-metrics',
            title: 'Performance Metrics',
            type: 'item',
            url: '/apps/performance-report'
        },
        {
            id: 'status-priorities',
            title: 'Priorities',
            type: 'item',
            url: '/apps/strategic-obj/priority'
        },
        {
            id: 'status-swot',
            title: 'SWOT',
            type: 'item',
            url: '/apps/strategic-obj/swot'
        },
        {
            id: 'status-emerging-trend',
            title: 'Emerging Trend',
            type: 'item',
            url: '/apps/strategic-obj/objective'
        } */
        //     ]
        // }
    );
}
export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: '',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        icon: 'apps',
        children: childrens
    }
];