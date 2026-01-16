/**
 * ============================================================================
 * MOCK DATA ENGINE - FOR PRESENTATION PURPOSES
 * ============================================================================
 * 
 * This script intercepts all fetch() calls and returns hardcoded mock data.
 * It ensures the frontend works without a running backend.
 * 
 * CONSISTENT DATA:
 * - Aggregator ID: Aggregator
 * - Aggregator Name: BAGYALAKSHMI Natural
 * - Username: baya@gmail.com
 * 
 * TO DISABLE: Simply remove this script from HTML files.
 * ============================================================================
 */

(function () {
    'use strict';

    console.log('🎭 MOCK DATA ENGINE ACTIVATED - Frontend is running in demo mode');

    // =========================================================================
    // MASTER MOCK DATA - Single source of truth
    // =========================================================================

    const MOCK_USER = {
        user_id: 'AGG-2619284',
        username: 'baya@gmail.com',
        org_name: 'BAGYALAKSHMI Natural',
        org_type: 'Individual',
        role: 'aggregator',
        user_role: 2,  // 1=Admin, 2=Aggregator, 3=Buyer
        email: 'baya@gmail.com',
        phone: '8888888588',
        address: 'Village: KODATHANAPALLE, GUDI PALLE',
        password: '1234',
        status: 1  // Approved
    };

    const MOCK_CATCHMENTS = [
        {
            aggregator_id: 'AGG-2619284',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '01106502',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502003',
            village_name: 'AVULATHIMMANPALLE',
            crop_name: 'FINGER_MILLET_RAGI',
            season: 'Kharif',
            period: '2025-26',
            status: 1  // Approved
        },
        {
            aggregator_id: 'AGG-2619284',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '01106502',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502003',
            village_name: 'AVULATHIMMANPALLE',
            crop_name: 'PADDY',
            season: 'Kharif',
            period: '2025-26',
            status: 1  // Approved
        }
    ];

    const MOCK_FARMERS = [
        {
            farmer_id: '103221240710072544',
            farmer_name: 'BAGYALAKSHMI',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'OTHER_C',
            crop_name: 'FINGER_MILLET_RAGI',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2025-05-05',
            acreage: 0.5,
            tileid_pli: '6418b6bc-1dc6-4965-b03b-e95a4120fce5',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502002',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.26047,
            geolocation_longitude: 13.83842,
            crop_practice: 'P_BA_P_P',
            status: 1
        },
        {
            farmer_id: '103220933712421919',
            farmer_name: 'MAHESWARI',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'OTHER_C',
            crop_name: 'FINGER_MILLET_RAGI',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2025-05-05',
            acreage: 0.5,
            tileid_pli: '7000cdca-0e01-4eca-b03b-e95a4120fce5',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502002',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.27231,
            geolocation_longitude: 13.84012,
            crop_practice: 'P_DA_P',
            status: 1
        },
        {
            farmer_id: '103220938510896199',
            farmer_name: 'PADMA M',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'OTHER_C',
            crop_name: 'FINGER_MILLET_RAGI',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2025-05-05',
            acreage: 0.5,
            tileid_pli: '8a12fd3e-5b78-49f2-a938-617afdabc391',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502002',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.26845,
            geolocation_longitude: 13.83956,
            crop_practice: 'P_DA_P',
            status: 1
        },
        {
            farmer_id: '103220937795133051',
            farmer_name: 'RAJESWAR',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'PADDY',
            crop_name: 'PADDY',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2025-05-05',
            acreage: 1.0,
            tileid_pli: '70000c0c-b010-4dc6-4eca-617afdabc392',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502003',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.27021,
            geolocation_longitude: 13.84102,
            crop_practice: 'P_DA_P',
            status: 1
        },
        {
            farmer_id: '103221407116464881',
            farmer_name: 'JANAMMA R',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'PADDY',
            crop_name: 'PADDY',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2025-05-05',
            acreage: 1.0,
            tileid_pli: '91bb2930-c3fe-4ca2-8e8b-36ce7442029e',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502003',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.26512,
            geolocation_longitude: 13.83678,
            crop_practice: 'P_DA_P',
            status: 1
        },
        {
            farmer_id: '103230353674344571',
            farmer_name: 'BAGYALAKSHMI K',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'FINGER',
            crop_name: 'FINGER_MILLET_RAGI',
            season: 'Kharif',
            period: '2021-26',
            sowing_date: '2025-05-15',
            acreage: 0.5,
            tileid_pli: 'Sa8e0cab-b011-4965-b03b-e95a4120fce5',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502003',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.26311,
            geolocation_longitude: 13.83512,
            crop_practice: 'P_BA_P_P',
            status: 1
        },
        {
            farmer_id: '103230536881851510',
            farmer_name: 'PAVITHRA',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'PADDY',
            crop_name: 'PADDY',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2025-05-20',
            acreage: 1.5,
            tileid_pli: '43ffee41-1111-4e2b-a9ef-30da547407ad',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502003',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.26789,
            geolocation_longitude: 13.84001,
            crop_practice: 'P_DA_P',
            status: 1
        },
        {
            farmer_id: '103305637001001685',
            farmer_name: 'VIJAYALAKSHMI',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'PADDY',
            crop_name: 'PADDY',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2020-02-25',
            acreage: 1.0,
            tileid_pli: 'c9d5b3b3-cc3b-446f-91a3-20498c84338f',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502003',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.26234,
            geolocation_longitude: 13.83456,
            crop_practice: 'P_DA_P',
            status: 1
        },
        {
            farmer_id: '103230537449065176',
            farmer_name: 'SAROJAMM',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'PADDY',
            crop_name: 'PADDY',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2025-06-01',
            acreage: 0.75,
            tileid_pli: 'f86f3ede-30be-469d-ba7c-7e57fc63324e',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502002',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.26521,
            geolocation_longitude: 13.83721,
            crop_practice: 'P_DA_P',
            status: 1
        },
        {
            farmer_id: '103220936710204318',
            farmer_name: 'S SUREKHA',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'PADDY',
            crop_name: 'PADDY',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2025-06-05',
            acreage: 1.25,
            tileid_pli: '2d179cb7-9d50-4b59-8de8-9808f5ce4333',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502002',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.26876,
            geolocation_longitude: 13.84112,
            crop_practice: 'P_BA_P_P',
            status: 1
        },
        {
            farmer_id: '103220935104129912',
            farmer_name: 'DANALAKSHMI',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'PADDY',
            crop_name: 'PADDY',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2025-06-10',
            acreage: 0.8,
            tileid_pli: '48d937bf-0cef-4901-bfea-4e0fc62d68af',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502002',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.27112,
            geolocation_longitude: 13.84234,
            crop_practice: 'P_DA_P',
            status: 1
        },
        {
            farmer_id: '103221241252277180',
            farmer_name: 'VENKATAPATI',
            farmer_category: 'S2S',
            is_s2s_crop: true,
            is_agrade_model: false,
            crop_type: 'PADDY',
            crop_name: 'PADDY',
            season: 'Kharif',
            period: '2025-26',
            sowing_date: '2025-06-15',
            acreage: 1.0,
            tileid_pli: '88933090-42fc-4980-a81c-af912eb7580c',
            district_code: '011001',
            district_name: 'CHITTOOR',
            mandal_code: '011065',
            mandal_name: 'GUDI PALLE',
            panchayat_code: '0110652',
            panchayat_name: 'KODATHANAPALLE',
            village_code: '01106502003',
            village_name: 'AVULATHIMMANPALLE',
            vo_code: '',
            vo_name: '',
            shg_code: '',
            shg_name: '',
            certification_url: 'https://...',
            geolocation_latitude: 78.26456,
            geolocation_longitude: 13.83589,
            crop_practice: 'P_DA_P',
            status: 1
        }
    ];

    const MOCK_DISTRICTS = [
        { id: '011001', name: 'CHITTOOR', code: '011001' },
        { id: 'D002', name: 'TIRUPATI', code: 'D002' },
        { id: 'D003', name: 'ANANTAPUR', code: 'D003' },
        { id: 'D004', name: 'KURNOOL', code: 'D004' },
        { id: 'D005', name: 'KADAPA', code: 'D005' }
    ];

    const MOCK_MANDALS = {
        '011001': [
            { id: '011065', name: 'GUDI PALLE', code: '011065' },
            { id: 'M002', name: 'MADANAPALLE', code: 'M002' },
            { id: 'M003', name: 'PUNGANUR', code: 'M003' }
        ],
        'D002': [
            { id: 'M004', name: 'CHANDRAGIRI', code: 'M004' },
            { id: 'M005', name: 'TIRUPATI RURAL', code: 'M005' }
        ],
        'D003': [
            { id: 'M006', name: 'HINDUPUR', code: 'M006' },
            { id: 'M007', name: 'PENUKONDA', code: 'M007' }
        ],
        'D004': [
            { id: 'M008', name: 'ADONI', code: 'M008' },
            { id: 'M009', name: 'YEMMIGANUR', code: 'M009' }
        ],
        'D005': [
            { id: 'M010', name: 'KADAPA', code: 'M010' },
            { id: 'M011', name: 'PRODDATUR', code: 'M011' }
        ]
    };

    const MOCK_PANCHAYATS = {
        '011065': [
            { id: '01106502', name: 'KODATHANAPALLE', code: '01106502' },
            { id: 'P002', name: 'GUDI PALLE TOWN', code: 'P002' }
        ],
        'M002': [{ id: 'P003', name: 'MADANAPALLE TOWN', code: 'P003' }],
        'M003': [{ id: 'P004', name: 'PUNGANUR TOWN', code: 'P004' }],
        'M004': [{ id: 'P005', name: 'SESHA PURAM', code: 'P005' }, { id: 'P006', name: 'BHEEMAVARAM', code: 'P006' }],
        'M005': [{ id: 'P007', name: 'TIRUPATI URBAN', code: 'P007' }],
        'M006': [{ id: 'P008', name: 'HINDUPUR TOWN', code: 'P008' }],
        'M007': [{ id: 'P009', name: 'PENUKONDA TOWN', code: 'P009' }],
        'M008': [{ id: 'P010', name: 'ADONI TOWN', code: 'P010' }],
        'M009': [{ id: 'P011', name: 'YEMMIGANUR TOWN', code: 'P011' }],
        'M010': [{ id: 'P012', name: 'KADAPA TOWN', code: 'P012' }],
        'M011': [{ id: 'P013', name: 'PRODDATUR TOWN', code: 'P013' }]
    };

    const MOCK_VILLAGES = {
        '01106502': [
            { id: '01106502003', name: 'AVULATHIMMANPALLE', code: '01106502003' },
            { id: '01106502002', name: 'KODATHANAPALLE VILLAGE', code: '01106502002' }
        ],
        'P002': [{ id: 'V002', name: 'GUDI PALLE VILLAGE', code: 'V002' }],
        'P003': [{ id: 'V003', name: 'MADANAPALLE VILLAGE', code: 'V003' }],
        'P004': [{ id: 'V004', name: 'PUNGANUR VILLAGE', code: 'V004' }],
        'P005': [{ id: 'V005', name: 'SESHA PURAM', code: 'V005' }],
        'P006': [{ id: 'V006', name: 'BHEEMAVARAM', code: 'V006' }],
        'P007': [{ id: 'V007', name: 'TIRUPATI URBAN', code: 'V007' }],
        'P008': [{ id: 'V008', name: 'HINDUPUR VILLAGE', code: 'V008' }],
        'P009': [{ id: 'V009', name: 'PENUKONDA VILLAGE', code: 'V009' }],
        'P010': [{ id: 'V010', name: 'ADONI VILLAGE', code: 'V010' }],
        'P011': [{ id: 'V011', name: 'YEMMIGANUR VILLAGE', code: 'V011' }],
        'P012': [{ id: 'V012', name: 'KADAPA VILLAGE', code: 'V012' }],
        'P013': [{ id: 'V013', name: 'PRODDATUR VILLAGE', code: 'V013' }]
    };

    const MOCK_CROPS = [
        { crop_id: 'C001', crop_name: 'Paddy', description: 'Naturally Gluten-free and high in dietary fibre, zero-chemical paddy is rich in Vitamins, essential minerals, complex carbohydrates, and natural antioxidants.', shelf_life: 365, storage: '10-12% moisture, cool, dry godown' },
        { crop_id: 'C002', crop_name: 'Rice', description: '', shelf_life: 280, storage: '10-12% moisture, protected from insects' },
        { crop_id: 'C003', crop_name: 'Maize', description: 'Nutrient-dense maize packed with fibre for better digestion, carotenoids, antioxidants , vitamins and essential minerals', shelf_life: 280, storage: '10-12% moisture, protected from insects' },
        { crop_id: 'C004', crop_name: 'Sorghum', description: 'Versatile, drought-tolerant, grown with minimal water footprint, gluten-free ancient grain, boasts high fiber for digestion.', shelf_life: 365, storage: '10-12% moisture, well-ventilated' },
        { crop_id: 'C005', crop_name: 'Pearl Millet', description: 'Naturally grown Pearl Millet - fiber-brimming, low glycemic index, iron-loaded, calcium powerhouse.', shelf_life: 365, storage: '10-12% moisture, insect-protected' },
        { crop_id: 'C006', crop_name: 'Finger Millet', description: 'Naturally grown - zero-chemical finger millet – diabetic friendly, gluten free , fiber-packed, iron-loaded super grain.', shelf_life: 365, storage: '10-12% moisture, good keeping quality' },
        { crop_id: 'C007', crop_name: 'Little Millet', description: '', shelf_life: 365, storage: '10-12% moisture, protected from insects' },
        { crop_id: 'C008', crop_name: 'Foxtail Millet', description: '', shelf_life: 365, storage: '10-12% moisture, protected from insects' },
        { crop_id: 'C009', crop_name: 'Kodo Millet', description: '', shelf_life: 365, storage: '10-12% moisture, protected from insects' },
        { crop_id: 'C010', crop_name: 'Barnyard Millet', description: '', shelf_life: 365, storage: '10-12% moisture, protected from insects' },
        { crop_id: 'C011', crop_name: 'Proso Millet', description: '', shelf_life: 365, storage: '10-12% moisture, protected from insects' },
        { crop_id: 'C012', crop_name: 'Red Gram', description: 'Red gram from naturally enriched soils -power up with zero-chemical , a plant protein-rich, fiber-packed super pulse.', shelf_life: 365, storage: '10-12% moisture, good ambient storage' },
        { crop_id: 'C013', crop_name: 'Black Gram', description: '', shelf_life: 365, storage: '10-12% moisture, good ambient storage' },
        { crop_id: 'C014', crop_name: 'Green Gram', description: 'Green gram – protein-packed, antioxidant-rich, gut-healthy , that fuels immunity, strengthens bones.', shelf_life: 365, storage: '10-12% moisture, good ambient storage' },
        { crop_id: 'C015', crop_name: 'Bengal Gram', description: 'Bengal gram grown in living soil with zero-chemicals, protein- and fiber-rich loaded with wholesome nutrition.', shelf_life: 365, storage: '10-12% moisture, good ambient storage' },
        { crop_id: 'C016', crop_name: 'Horse Gram', description: '', shelf_life: 365, storage: '10-12% moisture, good ambient storage' },
        { crop_id: 'C017', crop_name: 'Cow Pea', description: '', shelf_life: 365, storage: '10-12% moisture, good ambient storage' },
        { crop_id: 'C018', crop_name: 'Kidney Bean', description: '', shelf_life: 365, storage: '10-12% moisture, good ambient storage' },
        { crop_id: 'C019', crop_name: 'Groundnut', description: 'Rich in clean plant protein, wholesome natural oils, fibre, and antioxidant nutrients, remains free of aflatoxins.', shelf_life: 365, storage: '7-9% moisture, avoid humidity & heat' },
        { crop_id: 'C020', crop_name: 'Sunflower', description: '', shelf_life: 280, storage: '7-9% moisture, avoid humidity & heat' },
        { crop_id: 'C021', crop_name: 'Sesame', description: '', shelf_life: 365, storage: '7-9% moisture, protect from insects' },
        { crop_id: 'C022', crop_name: 'Castor', description: '', shelf_life: 365, storage: '7-9% moisture, cool & dry storage' },
        { crop_id: 'C023', crop_name: 'Dry Coconut', description: '', shelf_life: 365, storage: '7-9% moisture, moisture-proof packaging' },
        { crop_id: 'C024', crop_name: 'Dry Red Chilli', description: 'Red chilli from Andhra Pradesh stands out for its bold heat, vibrant natural colour, and rich flavour with higher aroma, antioxidant richness.', shelf_life: 365, storage: 'Fully dried, protected from insects' },
        { crop_id: 'C025', crop_name: 'Dry Turmeric', description: '', shelf_life: 365, storage: 'Whole fingers, moisture-proof bags' },
        { crop_id: 'C026', crop_name: 'Dry Ginger', description: '', shelf_life: 365, storage: 'Whole pieces, moisture-proof bags' },
        { crop_id: 'C027', crop_name: 'Coriander Seeds', description: '', shelf_life: 365, storage: 'Whole seeds, moisture-proof bags' },
        { crop_id: 'C028', crop_name: 'Tamarind', description: '', shelf_life: 365, storage: 'Properly dried, moisture-proof bags' },
        { crop_id: 'C029', crop_name: 'Ajwain', description: '', shelf_life: 365, storage: 'Whole seeds, moisture-proof bags' },
        { crop_id: 'C030', crop_name: 'Fenugreek', description: '', shelf_life: 365, storage: 'Whole seeds, moisture-proof bags' },
        { crop_id: 'C031', crop_name: 'Black Pepper', description: '', shelf_life: 365, storage: 'Whole seeds, cool & dry storage' },
        { crop_id: 'C032', crop_name: 'Coffee', description: '', shelf_life: 280, storage: 'Green beans, cool & dry storage' }
    ];

    const MOCK_SEASONS = [
        { season: 'Kharif', period: '2025-26' },
        { season: 'Rabi', period: '2025-26' },
        { season: 'Kharif', period: '2024-25' },
        { season: 'Rabi', period: '2024-25' }
    ];

    // =========================================================================
    // PRACTICES MASTER - All Natural Farming Practices
    // =========================================================================
    const PRACTICES_MASTER = [
        { id: 'P001', name: 'Beejamrutham', description: 'Natural seed treatment for germination protects seeds from seed-borne diseases', category: 'Bio Input' },
        { id: 'P002', name: 'Botanical Extracts/Kashayams', description: 'Plant-based pest and disease management', category: 'Bio Input' },
        { id: 'P003', name: 'PMDS', description: 'Pre-Monsoon Dry sowing system', category: 'Cropping Pattern' },
        { id: 'P004', name: 'Ghanajeevamrutham', description: 'Solid microbial inoculant for soil health', category: 'Soil Amendment' },
        { id: 'P005', name: 'Dhravajeevamrutham', description: 'Liquid microbial culture application', category: 'Soil Amendment' },
        { id: 'P006', name: 'Sticky Traps', description: 'Yellow/blue sticky traps used to attract and monitor insect pests', category: 'Mechanical Control' },
        { id: 'P007', name: 'Pheromone Traps', description: 'Sex pheromone-based traps for monitoring and controlling specific pests', category: 'Biological Control' },
        { id: 'P008', name: 'Chemical Free Practices', description: 'Complete avoidance of synthetic fertilizers and pesticides', category: 'Certification/Compliance' },
        { id: 'P009', name: 'Seedling Clipping', description: 'Clipping of seedling leaf tips to promote vigor and reduce transplanting shock', category: 'Field Practice' },
        { id: 'P010', name: 'Intercropping', description: 'Growing multiple crops simultaneously in the same field', category: 'Cropping Pattern' },
        { id: 'P011', name: 'Mixed Cropping', description: 'Cultivation of multiple crops together without a definite row pattern', category: 'Cropping Pattern' },
        { id: 'P012', name: 'Poly Cropping', description: 'Growing multiple crops sequentially or simultaneously in a season', category: 'Cropping Pattern' },
        { id: 'P013', name: 'Border Crops', description: 'Cultivating crops on field borders to manage pests', category: 'Cropping Pattern' },
        { id: 'P014', name: 'Installation of Bird perches', description: 'Erecting perches to attract predatory birds for natural pest control', category: 'Biological Control' },
        { id: 'P015', name: 'Application of Azolla (Paddy)', description: 'Used as green manure and nitrogen source', category: 'Cropping Pattern' },
        { id: 'P016', name: 'Mulching with crop residues', description: 'Covering soil with crop residues to conserve moisture and suppress weeds', category: 'Field Practice' },
        { id: 'P017', name: 'SRI/Line sowing (Paddy)', description: 'System of Rice Intensification / line sowing for higher yield', category: 'Field Practice' },
        { id: 'P018', name: 'Natural Growth Promoters', description: 'Natural formulations to enhance crop growth and plant immunity', category: 'Bio Input' },
        { id: 'P019', name: 'RDS', description: 'Rabi Dry Sowing System', category: 'Cropping Pattern' },
        { id: 'P020', name: 'PMDS in pelletisation Mode', description: 'Technique used in PMDS for better establishment', category: 'Field Practice' },
        { id: 'P021', name: 'PMDS kit', description: 'Standardized input kit provided for PMDS implementation', category: 'Input kit' },
        { id: 'P022', name: 'S2S kit', description: 'Standardized input kit used for sustaining farmer as S2S farmer', category: 'Input kit' }
    ];

    // =========================================================================
    // BATCH PRACTICES - Mapping batchId -> practiceIds
    // =========================================================================
    const BATCH_PRACTICES = {
        'BAT_20260105_A7X3K9': ['P001', 'P004', 'P005', 'P008', 'P010'],
        'BAT_20260106_B2M8P4': ['P001', 'P002', 'P004', 'P008', 'P015', 'P017'],
        'BAT_20260110_C5N1R7': ['P001', 'P003', 'P008', 'P016'],
        'BAT_20260112_D9Q6T2': ['P001', 'P004', 'P005', 'P008', 'P017']
    };

    // =========================================================================
    // PGS CERTIFICATES
    // =========================================================================
    const PGS_CERTIFICATES = [
        { certId: 'PGS-2025-001', type: 'PGS-Green', name: 'Participatory Guarantee System Certificate', batchId: 'BAT_20260105_A7X3K9', validFrom: '2025-01-01', validTo: '2026-12-31', link: '#pgs-cert-001' },
        { certId: 'PGS-2025-002', type: 'PGS-Green', name: 'Participatory Guarantee System Certificate', batchId: 'BAT_20260106_B2M8P4', validFrom: '2025-01-01', validTo: '2026-12-31', link: '#pgs-cert-002' },
        { certId: 'PGS-2025-003', type: 'PGS-Green', name: 'Participatory Guarantee System Certificate', batchId: 'BAT_20260110_C5N1R7', validFrom: '2025-01-01', validTo: '2026-12-31', link: '#pgs-cert-003' },
        { certId: 'PGS-2025-004', type: 'PGS-Green', name: 'Participatory Guarantee System Certificate', batchId: 'BAT_20260112_D9Q6T2', validFrom: '2025-01-01', validTo: '2026-12-31', link: '#pgs-cert-004' }
    ];

    const MOCK_BATCHES = [
        {
            batchId: 'BAT_20260105_A7X3K9',
            batchName: 'Finger Millet Ragi Batch - Kharif 2025',
            cropCode: 'C001',
            cropName: 'FINGER_MILLET_RAGI',
            cropVariety: 'Local Variety',
            season: 'Kharif',
            year: '2025-26',
            procurementDate: '2026-01-05',
            expiryDate: '2027-01-05',
            aggregatorId: 'AGG-2619284',
            aggregatorName: 'BAGYALAKSHMI Natural',
            catchmentArea: 'CHITTOOR - GUDI PALLE - KODATHANAPALLE',
            farmerSources: [
                { farmerId: '103221240710072544', farmerName: 'BAGYALAKSHMI', quantity: 150.5, consent: true },
                { farmerId: '103220933712421919', farmerName: 'MAHESWARI', quantity: 85.0, consent: true },
                { farmerId: '103220938510896199', farmerName: 'PADMA M', quantity: 72.0, consent: true },
                { farmerId: '103230353674344571', farmerName: 'BAGYALAKSHMI K', quantity: 95.5, consent: true }
            ]
        },
        {
            batchId: 'BAT_20260106_B2M8P4',
            batchName: 'Paddy Batch - Kharif 2025',
            cropCode: 'C002',
            cropName: 'PADDY',
            cropVariety: 'BPT-5204',
            season: 'Kharif',
            year: '2025-26',
            procurementDate: '2026-01-06',
            expiryDate: '2027-01-06',
            aggregatorId: 'AGG-2619284',
            aggregatorName: 'BAGYALAKSHMI Natural',
            catchmentArea: 'CHITTOOR - GUDI PALLE - KODATHANAPALLE',
            farmerSources: [
                { farmerId: '103220937795133051', farmerName: 'RAJESWAR', quantity: 200.0, consent: true },
                { farmerId: '103221407116464881', farmerName: 'JANAMMA R', quantity: 120.0, consent: true },
                { farmerId: '103230536881851510', farmerName: 'PAVITHRA', quantity: 180.0, consent: true },
                { farmerId: '103305637001001685', farmerName: 'VIJAYALAKSHMI', quantity: 145.0, consent: true },
                { farmerId: '103230537449065176', farmerName: 'SAROJAMM', quantity: 110.0, consent: true }
            ]
        },
        {
            batchId: 'BAT_20260110_C5N1R7',
            batchName: 'Finger Millet Batch 2 - Kharif 2025',
            cropCode: 'C001',
            cropName: 'FINGER_MILLET_RAGI',
            cropVariety: 'Local Variety',
            season: 'Kharif',
            year: '2025-26',
            procurementDate: '2026-01-10',
            expiryDate: '2027-01-10',
            aggregatorId: 'AGG-2619284',
            aggregatorName: 'BAGYALAKSHMI Natural',
            catchmentArea: 'CHITTOOR - GUDI PALLE - KODATHANAPALLE',
            farmerSources: [
                { farmerId: '103220936710204318', farmerName: 'S SUREKHA', quantity: 88.0, consent: true },
                { farmerId: '103220935104129912', farmerName: 'DANALAKSHMI', quantity: 65.0, consent: true }
            ]
        },
        {
            batchId: 'BAT_20260112_D9Q6T2',
            batchName: 'Paddy Batch 2 - Kharif 2025',
            cropCode: 'C002',
            cropName: 'PADDY',
            cropVariety: 'BPT-5204',
            season: 'Kharif',
            year: '2025-26',
            procurementDate: '2026-01-12',
            expiryDate: '2027-01-12',
            aggregatorId: 'AGG-2619284',
            aggregatorName: 'BAGYALAKSHMI Natural',
            catchmentArea: 'CHITTOOR - GUDI PALLE - KODATHANAPALLE',
            farmerSources: [
                { farmerId: '103221241252277180', farmerName: 'VENKATAPATI', quantity: 250.0, consent: true }
            ]
        }
    ];


    // =========================================================================
    // AUTO-LOGIN: Populate localStorage so dashboard works immediately
    // Always overwrite to ensure latest mock data is used
    // =========================================================================

    // Only auto-populate if no session exists (prevents overwriting Admin login)
    if (!localStorage.getItem('access_token')) {
        console.log('🔑 Auto-populating localStorage with mock user data (BAGYALAKSHMI Natural)');
        localStorage.setItem('access_token', 'mock-token-xyz-123');
        localStorage.setItem('user_id', MOCK_USER.user_id);
        localStorage.setItem('username', MOCK_USER.username);
        localStorage.setItem('user_role', MOCK_USER.user_role);
        localStorage.setItem('role', MOCK_USER.role);
        localStorage.setItem('user', JSON.stringify(MOCK_USER));
    } else {
        console.log('🔐 Session exists. Skipping auto-population (preserving current user).');
    }

    // Also populate sessionStorage with batches for mybatch.html


    // =========================================================================
    // EXPOSE MOCK DATA GLOBALLY
    // =========================================================================
    window.MOCK_DATA = {
        user: MOCK_USER,
        farmers: MOCK_FARMERS,
        batches: MOCK_BATCHES,
        catchments: MOCK_CATCHMENTS,
        crops: MOCK_CROPS,
        seasons: MOCK_SEASONS,
        practicesMaster: PRACTICES_MASTER,
        batchPractices: BATCH_PRACTICES,
        pgsCertificates: PGS_CERTIFICATES
    };

    // =========================================================================
    // MOCK DATA API - UNIFIED PERSISTENCE LAYER
    // =========================================================================

    const _loadFromStorage = (key) => {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
            console.error(`Error loading ${key} from localStorage`, e);
            return [];
        }
    };

    const _saveToStorage = (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving ${key} to localStorage`, e);
        }
    };

    window.MOCK_DATA_API = {

        // --- BATCHES ---

        getAllBatches: function () {
            // Merge MOCK + LocalStorage + SessionStorage unique batches
            const userBatches = _loadFromStorage('userBatches');
            const sessionBatches = JSON.parse(sessionStorage.getItem('myBatches') || '[]');

            const merged = [...window.MOCK_DATA.batches];

            [...userBatches, ...sessionBatches].forEach(b => {
                if (!merged.find(m => m.batchId === b.batchId)) {
                    merged.push(b);
                }
            });

            return merged;
        },

        getBatchById: function (batchId) {
            return this.getAllBatches().find(b => b.batchId === batchId);
        },

        saveBatch: function (batch) {
            // 1. Add to In-Memory MOCK_DATA (Critical for immediate use)
            if (!window.MOCK_DATA.batches.find(b => b.batchId === batch.batchId)) {
                window.MOCK_DATA.batches.push(batch);
            }

            // 2. Add to LocalStorage (Persistent)
            const userBatches = _loadFromStorage('userBatches');
            if (!userBatches.find(b => b.batchId === batch.batchId)) {
                userBatches.push(batch);
                _saveToStorage('userBatches', userBatches);
            }

            // 3. Add to SessionStorage (Legacy support for mybatch.js)
            const sessionBatches = JSON.parse(sessionStorage.getItem('myBatches') || '[]');
            if (!sessionBatches.find(b => b.batchId === batch.batchId)) {
                sessionBatches.push(batch);
                sessionStorage.setItem('myBatches', JSON.stringify(sessionBatches));
            }

            console.log(`✅ Batch ${batch.batchId} saved to MOCK + Local + Session storage`);
            return batch;
        },

        // --- CATCHMENTS ---

        getAllCatchments: function () {
            const userCatchments = _loadFromStorage('userCatchments');
            return [...window.MOCK_DATA.catchments, ...userCatchments];
        },

        saveCatchment: function (catchment) {
            // Auto-Approve Logic
            catchment.status = 1; // Approved
            catchment.approved_date = new Date().toISOString().split('T')[0];

            // 1. Add to In-Memory
            window.MOCK_DATA.catchments.push(catchment);

            // 2. Add to LocalStorage
            const userCatchments = _loadFromStorage('userCatchments');
            userCatchments.push(catchment);
            _saveToStorage('userCatchments', userCatchments);

            console.log(`✅ Catchment saved (Auto-Approved)`);
            return catchment;
        }
    };

    // =========================================================================
    // LEGACY HELPER FUNCTIONS (Mapped to new API)
    // =========================================================================

    window.getBatchById = (id) => window.MOCK_DATA_API.getBatchById(id);
    window.getAllBatches = () => window.MOCK_DATA_API.getAllBatches();
    window.getAllCatchments = () => window.MOCK_DATA_API.getAllCatchments();
    window.saveUserBatch = (b) => window.MOCK_DATA_API.saveBatch(b);
    window.saveUserCatchment = (c) => window.MOCK_DATA_API.saveCatchment(c);

    window.getFarmerById = function (farmerId) {
        return window.MOCK_DATA.farmers.find(f => f.farmer_id === farmerId);
    };

    window.getFarmersForBatch = function (batchId) {
        const batch = window.MOCK_DATA_API.getBatchById(batchId);
        if (!batch || !batch.farmerSources) return [];

        return batch.farmerSources.map(source => {
            const farmer = window.MOCK_DATA.farmers.find(f => f.farmer_id === source.farmerId);
            return farmer ? { ...farmer, quantity: source.quantity } : null;
        }).filter(f => f !== null);
    };

    window.getPracticesForBatch = function (batchId) {
        const practiceIds = window.MOCK_DATA.batchPractices[batchId] || [];
        return practiceIds.map(id => window.MOCK_DATA.practicesMaster.find(p => p.id === id)).filter(p => p);
    };

    window.getCertificateForBatch = function (batchId) {
        return window.MOCK_DATA.pgsCertificates.find(c => c.batchId === batchId);
    };

    window.getAllPractices = function () {
        return window.MOCK_DATA.practicesMaster;
    };

    // =========================================================================
    // INITIALIZATION: SYNC ON LOAD
    // =========================================================================
    (function syncStorageToMemory() {
        // Sync Batches
        const userBatches = _loadFromStorage('userBatches');
        userBatches.forEach(b => {
            if (!window.MOCK_DATA.batches.find(m => m.batchId === b.batchId)) {
                window.MOCK_DATA.batches.push(b);
            }
        });

        // Sync Catchments
        const userCatchments = _loadFromStorage('userCatchments');
        userCatchments.forEach(c => {
            window.MOCK_DATA.catchments.push(c);
        });

        console.log('🔄 Synced persistent data to MOCK memory layers');
    })();

    console.log('📊 MOCK_DATA_API initialized');

    // =========================================================================
    // FETCH INTERCEPTOR
    // =========================================================================

    const originalFetch = window.fetch;

    window.fetch = async function (url, options = {}) {
        const urlStr = typeof url === 'string' ? url : url.toString();

        console.log(`🔄 [MOCK] Intercepted: ${urlStr}`);

        // --- AUTH: Login (Role-Based) ---
        if (urlStr.includes('/auth/login')) {
            // Parse form data to get username
            let username = 'aggregator';
            if (options.body instanceof FormData) {
                username = (options.body.get('username') || '').trim();
            }

            const u = username.toLowerCase();
            let user;
            let redirectUrl;

            // 1. ADMIN CHECK
            if (u === 'admin') {
                user = {
                    user_id: 'ADMIN-001',
                    username: 'admin',
                    org_name: 'APCNF Administrator',
                    role: 'admin',
                    user_role: 1,
                    email: 'admin@apcnf.gov.in',
                    phone: '9000000001',
                    status: 1
                };
                redirectUrl = 'admin-approvals.html';
                console.log('✅ [MOCK] Login: ADMIN');
            }
            // 2. AGGREGATOR CHECK (or default)
            else {
                // User requirement: "IF IN USERNAME SOMEONE TYPES AGGREGATOR... REDIRECT TO AGGREGATOR"
                // Also "NOTHING ELSE SHOULD BE CHECKED".
                // We default to Aggregator for any non-admin input to keep it simple as requested.
                user = MOCK_USER; // Role 2
                redirectUrl = 'dashboard.html';
                console.log(`✅ [MOCK] Login: AGGREGATOR (Input: ${username})`);
            }

            // Update localStorage with correct user
            localStorage.setItem('access_token', 'mock-token-xyz-123');
            localStorage.setItem('user_id', user.user_id);
            localStorage.setItem('username', user.username);
            localStorage.setItem('user_role', user.user_role);
            localStorage.setItem('role', user.role);
            localStorage.setItem('user', JSON.stringify(user));

            return mockResponse({
                success: true,
                access_token: 'mock-token-xyz-123',
                user: user,
                redirect_url: redirectUrl
            });
        }

        // --- DASHBOARD: Summary Stats ---
        if (urlStr.includes('/dashboard/summary/')) {
            console.log('✅ [MOCK] Returning dashboard summary');
            return mockResponse({
                success: true,
                approved_catchments: MOCK_CATCHMENTS.filter(c => c.status === 1).length,
                approved_farmers: MOCK_FARMERS.length,
                total_batches: MOCK_BATCHES.length
            });
        }

        // --- CATCHMENT: My Requests ---
        if (urlStr.includes('/my-requests/')) {
            console.log('✅ [MOCK] Returning catchment requests');
            return mockResponse({
                success: true,
                count: MOCK_CATCHMENTS.length,
                requests: MOCK_CATCHMENTS
            });
        }

        // --- CATCHMENT: Farmers List ---
        if (urlStr.includes('/farmers/')) {
            console.log('✅ [MOCK] Returning farmers list');
            return mockResponse({
                success: true,
                count: MOCK_FARMERS.length,
                farmers: MOCK_FARMERS
            });
        }

        // --- DEMOGRAPHICS: Districts ---
        if (urlStr.includes('/demographics/districts')) {
            console.log('✅ [MOCK] Returning districts');
            return mockResponse({
                success: true,
                districts: MOCK_DISTRICTS
            });
        }

        // --- DEMOGRAPHICS: Mandals ---
        if (urlStr.includes('/demographics/mandals/')) {
            const districtId = urlStr.split('/mandals/')[1].split('?')[0];
            console.log(`✅ [MOCK] Returning mandals for district: ${districtId}`);
            return mockResponse({
                success: true,
                mandals: MOCK_MANDALS[districtId] || []
            });
        }

        // --- DEMOGRAPHICS: Panchayats ---
        if (urlStr.includes('/demographics/panchayats/')) {
            const mandalId = urlStr.split('/panchayats/')[1].split('?')[0];
            console.log(`✅ [MOCK] Returning panchayats for mandal: ${mandalId}`);
            return mockResponse({
                success: true,
                panchayats: MOCK_PANCHAYATS[mandalId] || []
            });
        }

        // --- DEMOGRAPHICS: Villages ---
        if (urlStr.includes('/demographics/villages/')) {
            const panchayatId = urlStr.split('/villages/')[1].split('?')[0];
            console.log(`✅ [MOCK] Returning villages for panchayat: ${panchayatId}`);
            return mockResponse({
                success: true,
                villages: MOCK_VILLAGES[panchayatId] || []
            });
        }

        // --- DEMOGRAPHICS: Crops ---
        if (urlStr.includes('/demographics/crops')) {
            console.log('✅ [MOCK] Returning crops');
            return mockResponse({
                success: true,
                crops: MOCK_CROPS
            });
        }

        // --- DEMOGRAPHICS: Seasons ---
        if (urlStr.includes('/demographics/seasons')) {
            console.log('✅ [MOCK] Returning seasons');
            return mockResponse({
                success: true,
                seasons: MOCK_SEASONS
            });
        }

        // --- DEMOGRAPHICS: VO (Village Organizations) ---
        if (urlStr.includes('/demographics/vo/')) {
            console.log('✅ [MOCK] Returning VOs (empty - using NA fallback)');
            return mockResponse({
                success: true,
                vos: []
            });
        }

        // --- DEMOGRAPHICS: SHG (Self Help Groups) ---
        if (urlStr.includes('/demographics/shg/')) {
            console.log('✅ [MOCK] Returning SHGs (empty - using NA fallback)');
            return mockResponse({
                success: true,
                shgs: []
            });
        }

        // --- CATCHMENT: Submit Request (POST) ---
        if (urlStr.includes('/catchment/request') && options.method === 'POST') {
            console.log('✅ [MOCK] Catchment request submitted successfully');
            return mockResponse({
                success: true,
                message: 'Catchment area request submitted successfully!',
                request_id: 'REQ-' + Date.now()
            });
        }

        // =====================================================================
        // ADMIN ENDPOINTS
        // =====================================================================

        // --- ADMIN: Pending Aggregators ---
        if (urlStr.includes('/admin/pending_aggregators')) {
            console.log('✅ [MOCK] Returning pending aggregators');
            return mockResponse({
                count: 2,
                aggregators: [
                    {
                        user_id: 'AGG-2619284',
                        org_name: 'Sunrise FPO',
                        type: 'FPO',
                        email: 'sunrise@fpo.org',
                        mobile: '9876543211',
                        documents: { registration: null, pan: 'pan_sunrise.pdf', aadhar: null }
                    },
                    {
                        user_id: 'AGG-2619285',
                        org_name: 'Kisan Collective',
                        type: 'Cooperative',
                        email: 'kisan@collective.in',
                        mobile: '9876543212',
                        documents: { registration: 'reg_kisan.pdf', pan: 'pan_kisan.pdf', aadhar: null }
                    }
                ]
            });
        }

        // --- ADMIN: Pending Buyers ---
        if (urlStr.includes('/admin/pending_buyers')) {
            console.log('✅ [MOCK] Returning pending buyers');
            return mockResponse({
                count: 1,
                buyers: [
                    {
                        user_id: 'BUY-3719001',
                        org_name: 'Metro Mart',
                        type: 'Retailer',
                        email: 'metro@mart.com',
                        mobile: '9876543220',
                        documents: { registration: 'reg_metro.pdf', pan: 'pan_metro.pdf', aadhar: null }
                    }
                ]
            });
        }

        // --- ADMIN: Application History ---
        if (urlStr.includes('/admin/application_history')) {
            console.log('✅ [MOCK] Returning application history');
            return mockResponse({
                count: 3,
                history: [
                    // ... (existing history items)
                    {
                        type: 'Aggregator',
                        user_id: 'Aggregator',
                        org_name: 'BAGYALAKSHMI Natural',
                        org_type: 'Individual',
                        email: 'baya@gmail.com',
                        mobile: '8888888588',
                        status: 'Approved',
                        documents: { registration: 'reg_bagyalakshmi.pdf', pan: 'pan_bagyalakshmi.pdf', aadhar: null }
                    },
                    {
                        type: 'Aggregator',
                        user_id: 'AGG-2619280',
                        org_name: 'Rejected FPO',
                        org_type: 'FPO',
                        email: 'rejected@fpo.org',
                        mobile: '9876543200',
                        status: 'Rejected',
                        documents: { registration: null, pan: null, aadhar: null }
                    },
                    {
                        type: 'Buyer',
                        user_id: 'BUY-3719000',
                        org_name: 'Approved Retail Store',
                        org_type: 'Retailer',
                        email: 'approved@retail.com',
                        mobile: '9876543230',
                        status: 'Approved',
                        documents: { registration: 'reg_retail.pdf', pan: 'pan_retail.pdf', aadhar: null }
                    }
                ]
            });
        }

        // =====================================================================
        // CATCHMENT MANAGEMENT (ADMIN)
        // =====================================================================

        // --- ADMIN: Pending Catchment Requests ---
        if (urlStr.includes('/api/catchment/pending')) {
            console.log('✅ [MOCK] Returning pending catchment requests');
            // Filter MOCK_CATCHMENTS where status is 0 (Pending) or 2 (which might be rejected, but usually 0 is pending)
            // Currently our MOCK_CATCHMENTS are auto-approved (status 1).
            // To show pending data, we can filter for specific IDs or just return a subset if none are found.
            // For DEMO: If no pending requests, let's fake one if the list is empty, OR just rely on logic.
            // But wait, user wants consistency. If I auto-approve, then it goes to history.
            // So Pending list might be empty. 
            // Let's return status === 0.
            const pending = MOCK_CATCHMENTS.filter(c => c.status === 0 || c.status === 'Pending');
            return mockResponse({
                success: true,
                count: pending.length,
                pending_requests: pending
            });
        }

        // --- ADMIN: Catchment History ---
        if (urlStr.includes('/api/catchment/history')) {
            console.log('✅ [MOCK] Returning catchment history');
            const history = MOCK_CATCHMENTS.filter(c => c.status === 1 || c.status === 2 || c.status === 'Approved' || c.status === 'Rejected');
            return mockResponse({
                success: true,
                total: history.length,
                history: history,
                total_pages: 1
            });
        }

        // --- ADMIN: Approve Catchment ---
        if (urlStr.includes('/api/catchment/approve/')) {
            const id = urlStr.split('/approve/')[1];
            console.log(`✅ [MOCK] Approving catchment: ${id}`);
            const catchItem = MOCK_CATCHMENTS.find(c => c.acm_id === id || c.catchment_id === id);
            if (catchItem) catchItem.status = 1;

            return mockResponse({
                success: true,
                message: 'Catchment approved successfully',
                stats: { farmers_from_urvi: 15, mappings_created: 15 }
            });
        }

        // --- ADMIN: Reject Catchment ---
        if (urlStr.includes('/api/catchment/reject/')) {
            const id = urlStr.split('/reject/')[1];
            console.log(`✅ [MOCK] Rejecting catchment: ${id}`);
            const catchItem = MOCK_CATCHMENTS.find(c => c.acm_id === id || c.catchment_id === id);
            if (catchItem) catchItem.status = 2; // Rejected

            return mockResponse({
                success: true,
                message: 'Catchment rejected successfully'
            });
        }

        // --- ADMIN: Approve/Reject Aggregator ---
        if (urlStr.includes('/admin/approve_aggregator/') || urlStr.includes('/admin/reject_aggregator/')) {
            const action = urlStr.includes('approve') ? 'approved' : 'rejected';
            console.log(`✅ [MOCK] Aggregator ${action}`);
            return mockResponse({
                success: true,
                message: `Aggregator has been ${action} successfully!`
            });
        }

        // --- ADMIN: Approve/Reject Buyer ---
        if (urlStr.includes('/admin/approve_buyer/') || urlStr.includes('/admin/reject_buyer/')) {
            const action = urlStr.includes('approve') ? 'approved' : 'rejected';
            console.log(`✅ [MOCK] Buyer ${action}`);
            return mockResponse({
                success: true,
                message: `Buyer has been ${action} successfully!`
            });
        }

        // --- DEFAULT: Pass through to real fetch ---
        console.log(`⚠️ [MOCK] No mock found, passing through: ${urlStr}`);
        return originalFetch(url, options);
    };

    // =========================================================================
    // HELPER: Create mock Response object
    // =========================================================================

    function mockResponse(data, status = 200) {
        return Promise.resolve(new Response(JSON.stringify(data), {
            status: status,
            headers: { 'Content-Type': 'application/json' }
        }));
    }

    console.log('🎭 Mock data engine ready. All API calls will return demo data.');

})();
