@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/profile_create_groups') }}">Profile create group</a> :
@endsection
@section("contentheader_description", $profile_create_group->$view_col)
@section("section", "Profile create groups")
@section("section_url", url(config('laraadmin.adminRoute') . '/profile_create_groups'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Profile create groups Edit : ".$profile_create_group->$view_col)

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

<div class="box">
	<div class="box-header">
		
	</div>
	<div class="box-body">
		<div class="row">
			<div class="col-md-8 col-md-offset-2">
				{!! Form::model($profile_create_group, ['route' => [config('laraadmin.adminRoute') . '.profile_create_groups.update', $profile_create_group->id ], 'method'=>'PUT', 'id' => 'profile_create_group-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'login_access_token')
					@la_input($module, 'admin_id')
					@la_input($module, 'group_name')
					@la_input($module, 'group_description')
					@la_input($module, 'company_id')
					@la_input($module, 'file')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/profile_create_groups') }}">Cancel</a></button>
					</div>
				{!! Form::close() !!}
			</div>
		</div>
	</div>
</div>

@endsection

@push('scripts')
<script>
$(function () {
	$("#profile_create_group-edit-form").validate({
		
	});
});
</script>
@endpush
