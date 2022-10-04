@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/profile_group_members') }}">Profile group member</a> :
@endsection
@section("contentheader_description", $profile_group_member->$view_col)
@section("section", "Profile group members")
@section("section_url", url(config('laraadmin.adminRoute') . '/profile_group_members'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Profile group members Edit : ".$profile_group_member->$view_col)

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
				{!! Form::model($profile_group_member, ['route' => [config('laraadmin.adminRoute') . '.profile_group_members.update', $profile_group_member->id ], 'method'=>'PUT', 'id' => 'profile_group_member-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'user_id')
					@la_input($module, 'group_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/profile_group_members') }}">Cancel</a></button>
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
	$("#profile_group_member-edit-form").validate({
		
	});
});
</script>
@endpush
