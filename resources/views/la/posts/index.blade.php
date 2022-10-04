@extends("la.layouts.app")

@section("contentheader_title", "Posts")
@section("contentheader_description", "Posts listing")
@section("section", "Posts")
@section("sub_section", "Listing")
@section("htmlheader_title", "Posts Listing")

@section("headerElems")
@la_access("Posts", "create")
	<button class="btn btn-success btn-sm pull-right" data-toggle="modal" data-target="#AddModal">Add Post</button>
@endla_access
@endsection

@section("main-content")

@if (count($errors) > 0)
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="box box-success">
	<!--<div class="box-header"></div>-->
	<div class="box-body">
		<table id="example1" class="table table-bordered">
		<thead>
		<tr class="success">
			@foreach( $listing_cols as $col )
			<th>{{ $module->fields[$col]['label'] or ucfirst($col) }}</th>
			@endforeach
			@if($show_actions)
			<th>Actions</th>
			@endif
		</tr>
		</thead>
		<tbody>
			
		</tbody>
		</table>
	</div>
</div>

@la_access("Posts", "create")
<div class="modal fade" id="AddModal" role="dialog" aria-labelledby="myModalLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Add Post</h4>
			</div>
			{!! Form::open(['action' => 'LA\PostsController@store', 'id' => 'post-add-form']) !!}
			<div class="modal-body">
				<div class="box-body">
                    @la_form($module)
					
					{{--
					@la_input($module, 'has_videoposter')
					@la_input($module, 'audio_content')
					@la_input($module, 'video_content')
					@la_input($module, 'content')
					@la_input($module, 'status')
					@la_input($module, 'shared')
					@la_input($module, 'featured')
					@la_input($module, 'album_descr')
					@la_input($module, 'has_album')
					@la_input($module, 'has_audiobground')
					@la_input($module, 'shared_post_id')
					@la_input($module, 'has_ytbVideo')
					@la_input($module, 'has_thyme')
					@la_input($module, 'has_audio')
					@la_input($module, 'has_video')
					@la_input($module, 'has_image')
					@la_input($module, 'page_id')
					@la_input($module, 'group_id')
					@la_input($module, 'timeline_user_id')
					@la_input($module, 'user_id')
					--}}
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				{!! Form::submit( 'Submit', ['class'=>'btn btn-success']) !!}
			</div>
			{!! Form::close() !!}
		</div>
	</div>
</div>
@endla_access

@endsection

@push('styles')
<link rel="stylesheet" type="text/css" href="{{ asset('la-assets/plugins/datatables/datatables.min.css') }}"/>
@endpush

@push('scripts')
<script src="{{ asset('la-assets/plugins/datatables/datatables.min.js') }}"></script>
<script>
$(function () {
	$("#example1").DataTable({
		processing: true,
        serverSide: true,
        ajax: "{{ url(config('laraadmin.adminRoute') . '/post_dt_ajax') }}",
		language: {
			lengthMenu: "_MENU_",
			search: "_INPUT_",
			searchPlaceholder: "Search"
		},
		@if($show_actions)
		columnDefs: [ { orderable: false, targets: [-1] }],
		@endif
	});
	$("#post-add-form").validate({
		
	});
});
</script>
@endpush
